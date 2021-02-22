const puppeteer = require("puppeteer");

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        console.log("Login page lms ...");
        const link = "https://lms.telkomuniversity.ac.id/login/index.php";
        await page.goto(link, {
            waitUntil: "networkidle2",
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

        const session = {
            sesskey: "",
            moodlesession: {},
        };
        session.sesskey = sesskey;
        session.moodlesession = MoodleSession;

        await browser.close();
        return session;
    } catch (error) {
        console.log(error.message);
    } finally {
        await browser.close();
    }
};
