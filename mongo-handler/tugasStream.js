const Tugas = require("../models/Tugas");
const Discord = require("discord.js");
const { DISCORD_CHANNEL_STREAM_ID } = process.env;
module.exports = async (client) => {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);
    const embed = new Discord.MessageEmbed();

    Tugas.watch().on("change", (event) => {
        console.log(`tugas activty : ${event.operationType}`);
        if (event.operationType === "insert") {
            const insertedData = event.fullDocument;

            channel.send(
                `<@&${DISCORD_KELAS_ROLE}>\n${new Date().toLocaleString(
                    "id-ID",
                    {
                        timeZone: "Asia/Jakarta",
                    }
                )} : ada tugas baru ***${insertedData.matkul} : ${
                    insertedData.tugas
                }***. cek channel <#${DISCORD_CHANNEL_ID}>`
            );
        }
    });
};
