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

  // use a library to run exponential backoff
  // https://www.npmjs.com/package/exponential-backoff

  backoff_seconds = 1;
  while (true) {
    try {
      await page.waitForXPath(reviewsButtonXPath, { timeout: 3000 });
      break;
    }
    catch (err) {
      console.log('Reviews button not found');
      if (backoff_seconds > 8) {
        console.log("the loop ran too many times, got passed 8, breaking")
        throw err;
      }
      console.log('Trying again in ' + backoff_seconds + ' seconds');
      await delay(backoff_seconds * 1000);
      backoff_seconds *= 2;
    }
  }
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
  if (newestDiv) {
    await newestDiv.click();
  } else {
    console.log("Element not found");
  }
  await delay(3000);
}

module.exports = {
  waitForReviews,
};
