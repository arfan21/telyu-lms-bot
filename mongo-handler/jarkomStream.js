const Discord = require("discord.js");
const Jarkom = require("../models/Jarkom");
const { DISCORD_CHANNEL_STREAM_ID } = process.env;
module.exports = async (client) => {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);
    const embed = new Discord.MessageEmbed();

    Jarkom.watch().on("change", (event) => {
        console.log(`jarkom activty : ${event.operationType}`);
        if (event.operationType === "insert") {
            const insertedData = event.fullDocument;

            channel.send(
                `<@&${DISCORD_KELAS_ROLE}>\n${new Date().toLocaleString(
                    "id-ID",
                    {
                        timeZone: "Asia/Jakarta",
                    }
                )} : ada tugas baru ***LAB JARKOM : ${
                    insertedData.title
                }***. cek channel <#${DISCORD_CHANNEL_ID}>`
            );

            channel.send(embed);
            channel.send("@everyone");
        }
    });
};
