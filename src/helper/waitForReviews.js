const delay = (ms) => new Promise((res) => setTimeout(res, ms));
/**
 * @version 1.0.0
 * @license MIT
 * @example node index.js
 * @author: Abdul Muttaqin
 */
async function waitForReviews(page) {
    const reviewsButtonXPath = "//button[contains(., 'Reviews')]";
    const sortButtonXPath = '//button[.//span[contains(text(), "Sort")]]';
    const newest = '//div[@role="menuitemradio"][.//div[contains(text(), "Newest")]]';

    await page.waitForXPath(reviewsButtonXPath, { timeout: 3000 });
    const reviewsButtons = await page.$x(reviewsButtonXPath);
    
    if (reviewsButtons.length > 0) {
      await reviewsButtons[0].click();
    } else {
      throw new Error('Reviews button not found');
    }
  
    await page.waitForXPath(sortButtonXPath);
    const [sortButton] = await page.$x(sortButtonXPath);
  
    if (sortButton) {
      await sortButton.click();
    } else {
      throw new Error('Sort button not found');
    }
    await delay(2000);

    await page.waitForXPath(newest);
    let [newestDiv] = await page.$x(newest);
    if(newestDiv){
        await newestDiv.click();
    }else{
        console.log("Element not found");
    }
    await delay(3000);
}

module.exports = {
    waitForReviews,
};
