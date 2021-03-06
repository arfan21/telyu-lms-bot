const Tugas = require("../models/Tugas");
const Discord = require("discord.js");
const { DISCORD_CHANNEL_STREAM_ID } = process.env;
module.exports = async (client) => {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);
    const embed = new Discord.MessageEmbed();
    embed
        .setColor("#0099ff")
        .setAuthor("Tugas Baru LMS", "https://i.imgur.com/wSTFkRM.png")
        .setTimestamp()
        .setFooter(``, "https://i.imgur.com/wSTFkRM.png");

    Tugas.watch().on("change", (event) => {
        console.log(`tugas activty : ${event.operationType}`);
        if (event.operationType === "insert") {
            const insertedData = event.fullDocument;
            const timeLocal =
                insertedData?.deadline?.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                }) ?? new Date();

            embed.addField(
                insertedData.matkul,
                `[${insertedData.tugas}](${insertedData.link})\n${timeLocal}`,
                false
            );
            channel.send(embed);
            channel.send("@everyone");
        }
    });
};
