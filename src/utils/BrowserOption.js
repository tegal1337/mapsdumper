
module.exports = {
    BrowserOption: function () {
        return {
            headless: "new",
            args: [
                "--log-level=3", // fatal only
                "--no-default-browser-check",
                "--disable-infobars",
                "--disable-web-security",
                "--disable-site-isolation-trials",
                "--no-experiments",
                "--ignore-gpu-blacklist",
                "--ignore-certificate-errors",
                "--ignore-certificate-errors-spki-list",
                "--mute-audio",
                "--disable-extensions",
                "--no-sandbox",
        
                "--no-first-run",
                "--no-zygote",
              ],
        }
    }
}

