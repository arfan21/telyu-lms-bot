const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

const jarkomLink =
    "https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/";

const selectorTitleLink = ".entry-title > a";
const selectorDay = ".day";
const selectorMonth = ".month";
const selectorYear = ".year";
const selectorLinks = ".vc_general";

module.exports = async () => {
    try {
        console.log("fetch page jaringan komputer ...");
        const bodyPageList = await fetch(jarkomLink, {
            method: "GET",
        }).then((result) => result.text());
        const domPageList = new JSDOM(bodyPageList);

        const titleLink = domPageList.window.document
            .querySelector(selectorTitleLink)
            .getAttribute("href");
        const title = domPageList.window.document.querySelector(
            selectorTitleLink
        ).innerHTML;

        console.log("fetch page tugas jarkom ...");
        const bodyPageTugas = await fetch(titleLink, {
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

        const elmDay = domPageList.window.document.querySelector(selectorDay);
        const elmMonth = domPageList.window.document.querySelector(
            selectorMonth
        );
        const elmYear = domPageList.window.document.querySelector(selectorYear);
        const date = `${elmDay.textContent
            .replace(/\n/g, "")
            .replace(/\t/g, "")} ${elmMonth.textContent
            .replace(/\n/g, "")
            .replace(/\t/g, "")} ${elmYear.textContent
            .replace(/\n/g, "")
            .replace(/\t/g, "")}`;

        const dataJarkom = {
            title: title,
            link_halaman: titleLink,
            link_soal: linksTugas[0],
            link_pengumpulan: linksTugas[1],
            date: new Date(date),
        };

        return dataJarkom;
    } catch (error) {
        console.log(error.message);
    }
};
