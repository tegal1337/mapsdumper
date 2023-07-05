/**
 *  @description Dilarang menjual ulang script ini , entah apapun alasan nya  :P , karna cuma saya yang ngerti :D
 * @author Abdul Muttaqin
 * @version 1.0.0
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