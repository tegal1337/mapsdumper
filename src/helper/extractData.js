const { Logger } = require("../utils/Logger");
const { waitForReviews } = require("./waitForReviews");
const fs = require('fs');
const { Parser } = require('json2csv');
/**
 * @version 1.0.0
 * @license MIT
 * @example node index.js
 * @author: Abdul Muttaqin
 */
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
    let responses = [];
    Logger("Looking for reviews ..", "green");
    let urlCounter = 0;
    page.on('response', async (response) => {
        const responseUrl = response.url();
        if (responseUrl.includes("listentitiesreviews")) {
            urlCounter += 1;
            if(urlCounter === 2) {
           Logger("Got API place ..", "green");
                let text = await response.text();
                text = text.replace(")]}'", "");
                let data = JSON.parse(text);
                let reviewData = [];
    
                data.forEach((item) => {
                    if (item) {
                        item.forEach((subItem) => {
                            if(subItem[0] && subItem[3] !== "google") {
                                const name = subItem[0][1];
                                const imageUrl = subItem[0][2];
                                const date = subItem[1];
                                const reviewText = subItem[3];
                                const starCount = subItem[4];
    
                                reviewData.push({
                                    date,
                                    name,
                                    imageUrl,
                                    reviewText,
                                    starCount
                                });
                            }
                        });
                    }
                });
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse({
                    title: dataplace.title,
                    rating: dataplace.rating,
                    numberOfReviews: dataplace.numberOfReviews,
                    category: dataplace.category,
                    address: dataplace.address,
                    website: dataplace.website,
                    phone: dataplace.phone,
                    imgLink: dataplace.imgLink,
                    // make review text joing with comma
                    reviewText: reviewData.map((item) => item.reviewText).join(','),
                });
                fs.writeFileSync('data.csv', csv + '\n', {flag: 'a'});
                responses.push({dataplace: dataplace, review: reviewData});
            }
        }
    });
    

    await waitForReviews(page);

    while (responses.length === 2) {
        await page.waitForTimeout(5000);
    }
    Logger("Done .. Got "+responses[0].review.length+" Reviews", "green");



    await page.close()
    return responses;
} catch (error) {
        Logger("No Reviews - Skip this" ,"red");
}
}

module.exports = {
extractData
}