const Discord = require("discord.js");
const Jarkom = require("../models/Jarkom");
const { DISCORD_CHANNEL_STREAM_ID } = process.env;
module.exports = async (client) => {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);
    const embed = new Discord.MessageEmbed();
    embed
        .setColor("#0099ff")
        .setAuthor(
            "TUGAS BARU LAB JARINGAN KOMPUTER",
            "https://i.imgur.com/wSTFkRM.png"
        )
        .setTimestamp()
        .setFooter(``, "https://i.imgur.com/wSTFkRM.png");

    Jarkom.watch().on("change", (event) => {
        console.log(`jarkom activty : ${event.operationType}`);
        if (event.operationType === "insert") {
            const insertedData = event.fullDocument;
            const timeLocal =
                insertedData?.deadline?.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                }) ?? new Date();

            embed.addField(
                "LAB JARKOM",
                `[sumber website lab informatika](https://informatics.labs.telkomuniversity.ac.id/category/praktikum/jaringan-komputer-if-it/)\n\n[${
                    insertedData.title
                }](${insertedData.link_halaman})\n[Soal Tugas](${
                    insertedData.link_soal
                })\n[Form Pengumpulan](${
                    insertedData.link_pengumpulan
                })\nCreated at ${insertedData.date.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "medium",
                })}`,
                false
            );
            channel.send(embed);
            channel.send("@everyone");
        }
    });
};
