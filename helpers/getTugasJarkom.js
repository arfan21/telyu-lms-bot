const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

const jarkomLink =
    "https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/";

const linkPengumpulan = "https://bit.ly/FormTPJRK";

const selectorTitleLink = ".entry-title > a";
const selectorDay = ".day";
const selectorMonth = ".month";
const selectorYear = ".year";
const selectorLinks = ".vc_general";

const timeNowMin = new Date();
timeNowMin.setDate(timeNowMin.getDate() - 4);

module.exports = async () => {
    const dataJarkom = {
        title: "",
        link_halaman: "",
        link_soal: "",
        link_pengumpulan: "",
        date: "",
    };
    const allDataJarkom = [];
    try {
        console.log("fetch page jaringan komputer ...");
        const bodyPageList = await fetch(jarkomLink, {
            method: "GET",
        }).then((result) => result.text());
        const domPageList = new JSDOM(bodyPageList);

        const titleLink = domPageList.window.document.querySelectorAll(
            selectorTitleLink
        );
        // .getAttribute("href");
        titleLink.forEach((elm) => {
            let data = { ...dataJarkom };
            data.link_halaman = elm.getAttribute("href");
            allDataJarkom.push(data);
        });

        const title = domPageList.window.document.querySelectorAll(
            selectorTitleLink
        );

        title.forEach((elm, index) => {
            allDataJarkom[index].title = elm.textContent;
        });

        const allDate = [];

        const elmDay = domPageList.window.document.querySelectorAll(
            selectorDay
        );

        elmDay.forEach((elm) => {
            let day = elm.textContent.replace(/\n/g, "").replace(/\t/g, "");
            allDate.push(day);
        });

        const elmMonth = domPageList.window.document.querySelectorAll(
            selectorMonth
        );

        elmMonth.forEach((elm, index) => {
            let month = elm.textContent.replace(/\n/g, "").replace(/\t/g, "");
            allDate[index] = `${allDate[index]} ${month}`;
        });

        const elmYear = domPageList.window.document.querySelectorAll(
            selectorYear
        );

        elmYear.forEach((elm, index) => {
            let year = elm.textContent.replace(/\n/g, "").replace(/\t/g, "");
            allDate[index] = `${allDate[index]} ${year}`;
            allDate[index] = new Date(allDate[index]);
            allDataJarkom[index].date = allDate[index];
            if (
                allDataJarkom[index].date > timeNowMin &&
                !allDataJarkom[index].title.includes("INT")
            ) {
                dataJarkom.title = allDataJarkom[index].title;
                dataJarkom.link_halaman = allDataJarkom[index].link_halaman;
                dataJarkom.link_pengumpulan =
                    allDataJarkom[index].link_pengumpulan;
                dataJarkom.link_soal = allDataJarkom[index].link_soal;
                dataJarkom.date = allDataJarkom[index].date;
            }
        });

        if (dataJarkom.link_halaman === "") {
            throw new Error("jarkom: not found");
        }

        console.log("fetch page tugas jarkom ...");
        const bodyPageTugas = await fetch(dataJarkom.link_halaman, {
            method: "GET",
        }).then((result) => result.text());

        const domPageTugas = new JSDOM(bodyPageTugas);
        const links = domPageTugas.window.document.querySelectorAll(
            selectorLinks
        );

        const linksTugas = [];
        links.forEach((elm) => {
            linksTugas.push(elm.getAttribute("href"));
        });
        dataJarkom.link_soal = linksTugas[0] ?? "";
        dataJarkom.link_pengumpulan = linksTugas[1] ?? linkPengumpulan;

        return dataJarkom;
    } catch (error) {
        console.log(error.message);
    }
};
