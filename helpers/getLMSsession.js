const puppeteer = require("puppeteer");

const lmsLink = "https://lms.telkomuniversity.ac.id/login/index.php";

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const session = {
        sesskey: "",
        moodlesession: {},
    };
    try {
        const page = await browser.newPage();
        await page.setDefaultTimeout(15000);
        await page.setDefaultNavigationTimeout(15000);
        console.log("Login page lms ...");

        await page.goto(lmsLink, {
            waitUntil: "networkidle2",
            timeout: 15000,
        });

        let lmsBtn = await page.$$("a.btn-block");
        lmsBtn.forEach(async (btn) => {
            await btn.click();
        });
        await page.waitForNavigation({ waitUntil: "networkidle0" });

        console.log("Login 365 ...");
        await page.type("#i0116", process.env.LMS_EMAIL);
        await page.click("#idSIButton9");
        await page.type("#i0118", process.env.LMS_PASSWORD);
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
        console.log("redirect to lms ...");
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });

        //check LMS if MT
        const checkLmsMT = await page.$("#page-maintenance-message");

        if (checkLmsMT) {
            session.sesskey = "LMS Maintenance";
            return session;
            // throw new Error("LMS Maintenance");
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
        return session;
    } catch (error) {
        console.log("getLMSsession :", error);
        return;
    } finally {
        await browser.close();
    }
};
