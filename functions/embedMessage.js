const Discord = require("discord.js");
const fetchActivity = require("./fetchActivity");
const insertTugas = require("../mongo-handler/insertTugas");
const getJarkom = require("../mongo-handler/getJarkom");
const getSisop = require("../mongo-handler/getSisop");
const getTugas = require("../mongo-handler/getTugas");

module.exports = async () => {
    const tick = new Date().getMinutes();
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor(
            "Tugas IF-43-12 LMS dan LAB",
            "https://i.imgur.com/wSTFkRM.png"
        )
        .setTimestamp()
        .setFooter(
            `${tick % 2 === 0 ? "⚪" : "⚫"} Last updated`,
            "https://i.imgur.com/wSTFkRM.png"
        );

    try {
        const [tugas, jarkom] = await Promise.all([
            fetchActivity(),
            getJarkom(),
        ]);
        if (tugas) {
            const listActions = tugas.data.events;
            await insertTugas(listActions);
        }

        const tugas_lms = await getTugas();

        var banyak_tugas_lms = tugas_lms.length;
        tugas_lms.forEach((item) => {
            const timeLocal = item.deadline.toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            });

            exampleEmbed.addField(
                item.matkul,
                `[${item.tugas}](${item.link})\n${timeLocal}`,
                true
            );
        });

        exampleEmbed.addField("\u200B", "\u200B", false);

        if (jarkom === null) {
            exampleEmbed.addField(
                "TUGAS LAB JARINGAN KOMPUTER",
                `[sumber website lab informatika](https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/)\n\nBelum ada tugas lab jaringan komputer\n${new Date().toLocaleString(
                    "id-ID",
                    {
                        timeZone: "Asia/Jakarta",
                    }
                )}`,
                true
            );
        } else {
            exampleEmbed.addField(
                "TUGAS LAB JARINGAN KOMPUTER",
                `[sumber website lab informatika](https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/)\n\n[${
                    jarkom.title
                }](${jarkom.link_halaman})\n[Soal Tugas](${
                    jarkom.link_soal
                })\n[Form Pengumpulan](${
                    jarkom.link_pengumpulan
                })\nCreated at ${jarkom.date.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "medium",
                })}`,
                true
            );
        }
    } catch (error) {
        console.log("embed message : ", error);
    }
    return {
        embed: exampleEmbed,
        banyak_tugas_lms,
    };
};
