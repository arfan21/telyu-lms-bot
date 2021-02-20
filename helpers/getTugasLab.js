const puppeteer = require("puppeteer");

const getJarkom = async (page) => {
    console.log("redirect to page jaringan komputer ...");
    await page.goto(
        "https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/",
        {
            waitUntil: "networkidle2",
        }
    );

    const selectorTitleLink = ".entry-title > a";
    const selectorDay = ".day";
    const selectorMonth = ".month";
    const selectorYear = ".year";

    try {
        const [linkHalaman, title, day, month, year] = await Promise.all([
            page.$eval(selectorTitleLink, (elm) => elm.href),
            page.$eval(selectorTitleLink, (elm) => elm.text),
            page.$eval(selectorDay, (elm) =>
                elm.textContent.replace(/\n/g, "").replace(/\t/g, "")
            ),
            page.$eval(selectorMonth, (elm) =>
                elm.textContent.replace(/\n/g, "").replace(/\t/g, "")
            ),
            page.$eval(selectorYear, (elm) =>
                elm.textContent.replace(/\n/g, "").replace(/\t/g, "")
            ),
        ]);

        console.log("redirect to page tugas ...");
        await page.goto(linkHalaman, {
            waitUntil: "networkidle2",
        });
        const selectorLinks = ".vc_general";

        const linksTugas = await page.$$eval(selectorLinks, (a) =>
            a.filter((a) => a.href).map((a) => a.href)
        );

        return {
            title: title,
            link_halaman: linkHalaman,
            link_soal: linksTugas[0],
            link_pengumpulan: linksTugas[1],
            date: new Date(`${day} ${month} ${year}`),
        };
    } catch (error) {}
};

const getSisop = async (page) => {
    console.log("redirect to page sistem operasi ...");
    await page.goto(
        "https://informatics.labs.telkomuniversity.ac.id/category/praktikum/sistem-operasi/",
        {
            waitUntil: "networkidle2",
        }
    );

    const selectorTitleLink = ".entry-title > a";
    const selectorDay = ".day";
    const selectorMonth = ".month";
    const selectorYear = ".year";

    try {
        const [linkHalaman, title, day, month, year] = await Promise.all([
            page.$eval(selectorTitleLink, (elm) => elm.href),
            page.$eval(selectorTitleLink, (elm) => elm.text),
            page.$eval(selectorDay, (elm) =>
                elm.textContent.replace(/\n/g, "").replace(/\t/g, "")
            ),
            page.$eval(selectorMonth, (elm) =>
                elm.textContent.replace(/\n/g, "").replace(/\t/g, "")
            ),
            page.$eval(selectorYear, (elm) =>
                elm.textContent.replace(/\n/g, "").replace(/\t/g, "")
            ),
        ]);

        console.log("redirect to page tugas ...");
        await page.goto(linkHalaman, {
            waitUntil: "networkidle2",
        });
        const selectorLinks = ".vc_general";

        const linksTugas = await page.$$eval(selectorLinks, (a) =>
            a.filter((a) => a.href).map((a) => a.href)
        );

        return {
            title: title,
            link_halaman: linkHalaman,
            link_soal: linksTugas[0],
            link_pengumpulan: linksTugas[1],
            date: new Date(`${day} ${month} ${year}`),
        };
    } catch (error) {}
};

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const dataJarkom = await getJarkom(page);
    const dataSisop = await getSisop(page);

    const tugasLAB = {
        jarkom: dataJarkom,
        sisop: dataSisop,
    };

    await browser.close();
    return tugasLAB;
};
