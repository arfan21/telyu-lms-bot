const puppeteer = require("puppeteer");
const writeSession = require("../../helpers/writeSession");

const igraciasLink = "https://igracias.telkomuniversity.ac.id/index.php";

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: false });
    try {
        const page = await browser.newPage();
        page.setDefaultTimeout(15000);
        page.setDefaultNavigationTimeout(15000);
        console.log("Redirect to Login Page IGRACIAS Telkom Univ ...");

        await page.goto(igraciasLink, {
            waitUntil: "networkidle2",
            timeout: 15000,
        });
    } catch (error) {
        console.log("get igracias session error :", error);
        return error;
    } finally {
        await browser.close();
    }
};
