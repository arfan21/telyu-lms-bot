require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const deleteAllMessage = require("./functions/deleteAllMessage");
const sendEmbed = require("./functions/sendEmbed");
const mongoUri = require("./mongoUri");
const client = new Discord.Client();
const channelId = "811186867391037461";

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

client.on("ready", async () => {
    client.channels.fetch(channelId).then(async (channel) => {
        let lastMessageID = channel.lastMessageID;

        try {
            let msg = await channel.messages.fetch(lastMessageID);
            let embededMsg = await sendEmbed();
            await msg.edit(embededMsg);
            setInterval(async () => {
                let embededMsg = await sendEmbed();
                msg.edit(embededMsg);
            }, 1000 * 60 * 10);
        } catch (error) {
            if (error.httpStatus === 403) {
                await deleteAllMessage(channel);

                let embededMsg = await sendEmbed();
                channel.send(embededMsg).then((msg) => {
                    setInterval(async () => {
                        let embededMsg = await sendEmbed();
                        msg.edit(embededMsg);
                    }, 1000 * 60 * 10);
                });
            }

            if (error.httpStatus === 404) {
                let embededMsg = await sendEmbed();

                channel.send(embededMsg).then((msg) => {
                    setInterval(async () => {
                        let embededMsg = await sendEmbed();
                        msg.edit(embededMsg);
                    }, 1000 * 20);
                });
            }
        }
    });

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(process.env.DISCORD_TOKEN);
