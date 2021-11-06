const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

const urlPage =
    "https://informatics.labs.telkomuniversity.ac.id/category/praktikum/pbo/";

const selectorTitleLink = ".entry-title > a";
const selectorDay = ".day";
const selectorMonth = ".month";
const selectorYear = ".year";
const selectorLinks = ".wp-block-button__link";

const timeNowMin = new Date();
timeNowMin.setDate(timeNowMin.getDate() - 4);

module.exports = async () => {
    const data = {
        title: "",
        link_halaman: "",
        link_soal: "",
        date: "",
    };
    const allData = [];
    try {
        console.log("fetch page if lab ...");
        const bodyPageList = await fetch(urlPage, {
            method: "GET",
        }).then((result) => result.text());
        const domPageList = new JSDOM(bodyPageList);

        const titleLink =
            domPageList.window.document.querySelectorAll(selectorTitleLink);

        titleLink.forEach((elm) => {
            let dataOnElm = { ...data };

            dataOnElm.link_halaman = elm.getAttribute("href");
            allData.push(dataOnElm);
        });

        const title =
            domPageList.window.document.querySelectorAll(selectorTitleLink);

        title.forEach((elm, index) => {
            allData[index].title = elm.textContent;
        });

        const allDate = [];

        const elmDay =
            domPageList.window.document.querySelectorAll(selectorDay);

        elmDay.forEach((elm) => {
            let day = elm.textContent.replace(/\n/g, "").replace(/\t/g, "");
            allDate.push(day);
        });

        const elmMonth =
            domPageList.window.document.querySelectorAll(selectorMonth);

        elmMonth.forEach((elm, index) => {
            let month = elm.textContent.replace(/\n/g, "").replace(/\t/g, "");
            allDate[index] = `${allDate[index]} ${month}`;
        });

        const elmYear =
            domPageList.window.document.querySelectorAll(selectorYear);

        elmYear.forEach((elm, index) => {
            let year = elm.textContent.replace(/\n/g, "").replace(/\t/g, "");
            allDate[index] = `${allDate[index]} ${year}`;
            allDate[index] = new Date(allDate[index]);
            allData[index].date = allDate[index];

            if (
                allData[index].date > timeNowMin &&
                !allData[index].title.includes("INT")
            ) {
                data.title = allData[index].title;
                data.link_halaman = allData[index].link_halaman;
                data.link_soal = allData[index].link_soal;
                data.date = allData[index].date;
            }
        });

        if (data.link_halaman === "") {
            throw new Error("LAB: not found");
        }

        console.log("fetch page tugas ...");
        const bodyPageTugas = await fetch(data.link_halaman, {
            method: "GET",
        }).then((result) => result.text());

        const domPageTugas = new JSDOM(bodyPageTugas);
        const links =
            domPageTugas.window.document.querySelectorAll(selectorLinks);

        const linksTugas = [];
        links.forEach((elm) => {
            linksTugas.push(elm.getAttribute("href"));
        });
        data.link_soal = linksTugas[0] ?? "";

        return data;
    } catch (error) {
        console.log("ERROR FETCH PAGE LAB:", error.message);
    }
};
