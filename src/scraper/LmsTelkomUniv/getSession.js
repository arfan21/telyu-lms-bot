const puppeteer = require("puppeteer");
const writeSession = require("../../helpers/writeSession");

const lmsLink = "https://lms.telkomuniversity.ac.id/login/index.php";

module.exports = async (key, email, password) => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const session = {
            sesskey: "",
            moodlesession: {},
        };

        const page = await browser.newPage();
        page.setDefaultTimeout(15000);
        page.setDefaultNavigationTimeout(15000);
        console.log("Redirect to Login Page LMS Telkom Univ ...");

        await page.goto(lmsLink, {
            waitUntil: "networkidle2",
            timeout: 15000,
        });

        const lmsBtn = await page.$$("a.btn-block");
        lmsBtn.forEach(async (btn) => {
            await btn.click();
        });
        await page.waitForNavigation({ waitUntil: "networkidle0" });

        console.log("Redirect to Login Page 365 ...");

        await page.type("#i0116", email);
        await page.click("#idSIButton9");
        await page.type("#i0118", password);

        let btnVal = "";
        while (btnVal !== "Yes") {
            try {
                const btn = await page.$$("#idSIButton9");
                btn.forEach(async (btnProp) => {
                    try {
                        let val = await btnProp.getProperty("value");
                        btnVal = await val.jsonValue();

                        if (btnVal === "Sign in") {
                            await page.click("#idSIButton9");
                        }
                        if (btnVal === "Yes") {
                            await page.click("#idSIButton9");
                        }
                    } catch (error) {}
                });
            } catch (error) {}
        }

        console.log("Redirect to LMS Telkom Univ ...");
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });

        const checkLmsMT = await page.$("#page-maintenance-message");
        if (checkLmsMT) {
            throw new Error("LMS Maintenance");
        }

        console.log("try to get sesskey and moodlesession ...");
        const data = await page.evaluate(() => {
            const list_a = Array.from(
                document.querySelectorAll(".dropdown-menu-right a")
            );
            return list_a.map((a) => a.href);
        });

        let sesskey = "";
        data.forEach((link) => {
            let url = new URL(link);
            if (url.searchParams.get("sesskey") !== null) {
                sesskey = url.searchParams.get("sesskey");
                return;
            }
        });

        const cookies = await page.cookies();
        const MoodleSession = {};
        cookies.forEach((cookie) => {
            if (cookie["name"] === "MoodleSession") {
                Object.assign(MoodleSession, cookie);
                return;
            }
        });

        session.sesskey = sesskey;
        session.moodlesession = MoodleSession;

        await browser.close();
        console.log("success to get sesskey and moodlesession ...");
        await writeSession(key, session);
        return session;
    } catch (error) {
        console.log("getLMSsession :", error);
        return error;
    } finally {
        await browser.close();
    }
};
