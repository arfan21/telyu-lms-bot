require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const deleteAllMessage = require("./functions/deleteAllMessage");
const embedMessage = require("./functions/embedMessage");
const mongoUri = require("./mongoUri");
const client = new Discord.Client();
const channelId = process.env.DISCORD_CHANNEL_ID;
const timeInterval = 1000 * 60 * 10;

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

const sendMessageToChannel = async (channel) => {
    let lastMessageID = channel.lastMessageID;
    try {
        console.log(`sending message to channel : ${channelId}`);

        let msg = await channel.messages.fetch(lastMessageID);
        let embededMsg = await embedMessage();
        await msg.edit(embededMsg);

        console.log(`SUCCESS : message sent`);
    } catch (error) {
        console.log(`ERROR : sending message to channel : ${channelId}`);
        if (error.httpStatus === 403) {
            await deleteAllMessage(channel);
            console.log(`RETRY : sending message to channel : ${channelId}`);

            let embededMsg = await embedMessage();
            await channel.send(embededMsg);

            console.log(`SUCCESS : message sent`);
        }

        if (error.httpStatus === 404) {
            console.log(`RETRY : sending message to channel : ${channelId}`);

            let embededMsg = await embedMessage();
            await channel.send(embededMsg);

            console.log(`SUCCESS : message sent`);
        }
    }
};

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.channels.fetch(channelId).then(async (channel) => {
        await sendMessageToChannel(channel);
        setInterval(async () => {
            await sendMessageToChannel(channel);
        }, timeInterval);
    });
});

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(process.env.DISCORD_TOKEN);
