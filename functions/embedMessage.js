const Discord = require("discord.js");
const getTugasLab = require("../helpers/getTugasLab");
const fetchActivity = require("./fetchActivity");
const getTugas = require("./getTugas");
const insertTugas = require("./insertTugas");

module.exports = async () => {
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor(
            "Tugas IF-43-12 LMS dan LAB",
            "https://i.imgur.com/wSTFkRM.png"
        )
        .setTimestamp()
        .setFooter("Last updated", "https://i.imgur.com/wSTFkRM.png");

    try {
        data = await fetchActivity();

        const listActions = data.data.events;
        await insertTugas(listActions);

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
        const { jarkom, sisop } = await getTugasLab();
        const timeNowMin = new Date();
        timeNowMin.setDate(timeNowMin.getDate() - 5);

        exampleEmbed.addField("\u200B", "\u200B");
        exampleEmbed.addField(
            "TUGAS LAB JARINGAN KOMPUTER",
            "[sumber website lab informatika](https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/)",
            false
        );

        if (!jarkom) {
            exampleEmbed.addField(
                "Belum ada tugas lab jaringan komputer",
                new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                })
            );
        } else if (jarkom.date < timeNowMin) {
            exampleEmbed.addField(
                "Belum ada tugas lab jaringan komputer",
                new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                })
            );
        } else {
            exampleEmbed.addField(
                jarkom.title,
                `[Link Halaman](${jarkom.link_halaman})\n[Soal Tugas](${
                    jarkom.link_soal
                })\n[Form Pengumpulan](${
                    jarkom.link_pengumpulan
                })\nCreated at ${jarkom.date.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "medium",
                })}`
            );
        }

        // exampleEmbed.addField("\u200B", "\u200B");
        // exampleEmbed.addField(
        //     "TUGAS LAB SISTEM OPERASI",
        //     "[di dapat dari website lab informatika](https://informatics.labs.telkomuniversity.ac.id/category/praktikum/sistem-operasi/)",
        //     false
        // );

        // if (!sisop) {
        //     exampleEmbed.addField(
        //         "Belum ada tugas lab sistem operasi",
        //         new Date().toLocaleString("id-ID", {
        //             timeZone: "Asia/Jakarta",
        //         })
        //     );
        // } else if (sisop.date < timeNowMin) {
        //     exampleEmbed.addField(
        //         "Belum ada tugas lab sistem operasi",
        //         new Date().toLocaleString("id-ID", {
        //             timeZone: "Asia/Jakarta",
        //         })
        //     );
        // } else {
        //     exampleEmbed.addField(
        //         sisop.title,
        //         `[Link Halaman](${sisop.link_halaman})\n[Soal Tugas](${
        //             sisop.link_soal
        //         })\n[Form Pengumpulan](${
        //             sisop.link_pengumpulan
        //         })\nUploaded on ${jarkom.date.toDateString()}`
        //     );
        // }
    } catch (error) {
        console.log(error);
    }
    return {
        embed: exampleEmbed,
        banyak_tugas_lms,
    };
};
