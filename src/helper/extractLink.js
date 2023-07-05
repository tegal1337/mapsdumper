/**
 * @version 1.0.0
 * @license MIT
 * @example node index.js
 * @author: Abdul Muttaqin
 */
async function extractLinks(page) {
    return page.$$eval('a[href]', anchors => {
        return anchors
            .map(anchor => anchor.getAttribute('href'))
            .filter(href => href.includes('https://www.google.com/maps/place/'));
    });
}
module.exports = {
    extractLinks
}