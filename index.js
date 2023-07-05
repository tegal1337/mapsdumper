#!/usr/bin/env node
/**
 * @version 1.0.0
 * @license MIT
 * @example node index.js
 * @author: Abdul Muttaqin
 */
const puppeteer = require('puppeteer');
const {
    extractData,
    extractLinks
} = require('./src');
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
const fs = require('fs');
const {
    Logger
} = require('./src/utils/Logger');
const Banner = require('./src/utils/Banner');
const {
    BrowserOption
} = require('./src/utils/BrowserOption');
console.clear();
console.log(Banner.Banner());
async function scraperPlace(query, latlong) {
    const browser = await puppeteer.launch(BrowserOption());
    Logger("Start the process ..", "green");
    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 4268
    });
    await page.goto('https://www.google.com/maps/search/' + encodeURIComponent(query) + '/?authuser=0&hl=en&entry=ttu');
    Logger("Open Maps ..", "green");
    const links = await extractLinks(page);
    let allData = [];
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        Logger(`Open Links [ ${i+1} ]`, "green");
        const scrapplace = await browser.newPage();
        try {
            await scrapplace.setViewport({
                width: 1366,
                height: 4268
            });
            await scrapplace.goto(link);
            let data = await extractData(scrapplace);
            allData.push(data);
        } catch (error) {
            console.log(error)
            await scrapplace.close()
        }
    }
    await browser.close();
    return allData;
}

async function scraperSinglePlace(url) {
    const browser = await puppeteer.launch(BrowserOption());
    const scrapplace = await browser.newPage();
    try {
        await scrapplace.setViewport({
            width: 1366,
            height: 1268
        });
        await scrapplace.goto(url);
        let data = await extractData(scrapplace);
        await browser.close()
        return data;
    } catch (error) {
        await scrapplace.close()
    }
}

async function main() {
    try {
        const methodAnswer = await enquirer.prompt({
            type: 'select',
            name: 'method',
            message: 'What do you want to do?',
            choices: ['Scrape a place', 'Scrape a single place']
        });

        if (methodAnswer.method === 'Scrape a place') {
            const placeAnswers = await enquirer.prompt([{
                type: 'input',
                name: 'query',
                message: 'Enter the query to scrape'
            }]);
            try {
                await scraperPlace(placeAnswers.query, placeAnswers.latlong);
            } catch (error) {
                console.log(error)
                Logger("Something wrong ..", "red");
            }

        } else if (methodAnswer.method === 'Scrape a single place') {
            const urlAnswer = await enquirer.prompt({
                type: 'input',
                name: 'url',
                message: 'Enter the URL of the place to scrape'
            });
            try {
                await scraperSinglePlace(urlAnswer.url);
            } catch (error) {
                Logger("Something wrong ..", "red");
            }
        }
    } catch (err) {
        Logger("No Reviews Found", "red");
    }
}

main();