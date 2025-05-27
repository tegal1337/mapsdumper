require("console");
const { Logger } = require("../utils/Logger");
const { waitForReviews } = require("./waitForReviews");
const fs = require('fs');
const { Parser } = require('json2csv');

async function extractData(page) {
    try {
        Logger("Extracting data ..", "green");
        
        const dataplace = await page.evaluate(() => {
            const title = document.querySelector('h1')?.innerText || '';
            const ratingText = document.querySelector('div.F7nice')?.innerText || '';

            let rating = null;
            let numberOfReviews = null;

            if (ratingText) {
                rating = parseFloat(ratingText.slice(0, 3).replace(',', '.'));
                numberOfReviews = parseInt(ratingText.slice(3).replace(/\D/g, ''), 10);
            }

            const category = document.querySelector('button[jsaction="pane.rating.category"]')?.innerText || '';
            const address = document.querySelector('button[data-item-id="address"]')?.innerText || '';
            const website = document.querySelector('a[data-item-id="authority"]')?.href || '';
            const phone = document.querySelector('button[data-item-id^="phone:tel:"]')?.getAttribute('data-item-id').replace('phone:tel:', '') || '';
            const imgLink = document.querySelector('.RZ66Rb.FgCUCc img')?.src || '';

            return {
                title,
                rating,
                numberOfReviews,
                category,
                address,
                website,
                phone,
                imgLink,
            };
        });

        Logger(`Get data from [${dataplace.title}] `, "yellow");
        
        await waitForReviews(page);
        
        Logger("Looking for reviews ..", "green");
        
        await page.waitForSelector('::-p-xpath(//div[contains(@class, "jftiEf") and contains(@class, "fontBodyMedium")])');
        
        const reviewData = await page.evaluate(() => {
            const reviews = [];
            
            const reviewContainers = document.evaluate(
                '//div[contains(@class, "jftiEf") and contains(@class, "fontBodyMedium")]',
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
            
            for (let i = 0; i < reviewContainers.snapshotLength; i++) {
                const reviewElement = reviewContainers.snapshotItem(i);
                
                const nameElement = document.evaluate(
                    './/div[contains(@class, "d4r55")]',
                    reviewElement,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                
                const imageElement = document.evaluate(
                    './/img[contains(@class, "NBa7we")]',
                    reviewElement,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                
                const dateElement = document.evaluate(
                    './/span[contains(@class, "rsqaWe")]',
                    reviewElement,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                
                const reviewTextElement = document.evaluate(
                    './/span[contains(@class, "wiI7pd")]',
                    reviewElement,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                
                const filledStarsElements = document.evaluate(
                    './/span[contains(@class, "hCCjke") and contains(@class, "elGi1d")]',
                    reviewElement,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );
                
                const name = nameElement?.innerText || '';
                const imageUrl = imageElement?.src || '';
                const date = dateElement?.innerText || '';
                const reviewText = reviewTextElement?.innerText || '';
                const starCount = filledStarsElements.snapshotLength;
                
                if (name && reviewText) {
                    reviews.push({
                        date,
                        name,
                        imageUrl,
                        reviewText,
                        starCount
                    });
                }
            }
            
            return reviews;
        });

        if (reviewData.length === 0) {
            Logger("No Reviews - Skip this", "red");
            return [];
        }

        Logger("Done .. Got " + reviewData.length + " Reviews", "green");

        const csvData = reviewData.map(review => ({
            placeTitle: dataplace.title,
            placeRating: dataplace.rating,
            placeNumberOfReviews: dataplace.numberOfReviews,
            placeCategory: dataplace.category,
            placeAddress: dataplace.address,
            placeWebsite: dataplace.website,
            placePhone: dataplace.phone,
            placeImgLink: dataplace.imgLink,
            reviewerName: review.name,
            reviewerImageUrl: review.imageUrl,
            reviewDate: review.date,
            reviewText: review.reviewText.replace(/,/g, ';'),
            reviewStarCount: review.starCount
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(csvData);
        
        const fileExists = fs.existsSync('data.csv');
        if (!fileExists) {
            fs.writeFileSync('data.csv', csv + '\n');
        } else {
            const csvLines = csv.split('\n');
            const dataWithoutHeader = csvLines.slice(1).join('\n');
            fs.appendFileSync('data.csv', dataWithoutHeader + '\n');
        }

        await page.close();
        return [{ dataplace: dataplace, review: reviewData }];
        
    } catch (error) {
        Logger("Error in extractData", "red");
        console.log(error);
        Logger("No Reviews - Skip this", "red");
        return [];
    }
}

module.exports = {
    extractData
};