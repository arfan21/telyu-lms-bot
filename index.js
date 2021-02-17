require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const deleteAllMessage = require("./functions/deleteAllMessage");
const embedMessage = require("./functions/embedMessage");
const mongoUri = require("./mongoUri");
const client = new Discord.Client();
const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID,
    TIMEINTERVAL_MS,
    TIMEINTERVAL_S,
    TIMEINTERVAL_M,
} = process.env;

const timeInterval =
    parseInt(TIMEINTERVAL_MS) *
    parseInt(TIMEINTERVAL_S) *
    parseInt(TIMEINTERVAL_M);

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

const sendMessageToChannel = async (channel) => {
    const channelName = channel.name;
    const lastMessageID = channel.lastMessageID;
    const embededMsg = await embedMessage();
    const embededMsgFieldsLenght = embededMsg.fields.length;

    client.user.setActivity(
        `LMS Ada ${embededMsgFieldsLenght} Tugas, cek channel ${channelName}`
    );

    if (lastMessageID === null) {
        console.log(`sending message to channel : ${DISCORD_CHANNEL_ID}`);

        await channel.send(embededMsg);

        console.log(`SUCCESS : message sent`);
    }
    try {
        console.log(`sending message to channel : ${DISCORD_CHANNEL_ID}`);

        let msg = await channel.messages.fetch(lastMessageID);

        await msg.edit(embededMsg);

        console.log(`SUCCESS : message sent`);
    } catch (error) {
        console.log(`ERROR : sending message to channel : ${error.message}`);

        if (error.httpStatus === 403) {
            await deleteAllMessage(channel);
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );

            await channel.send(embededMsg);

            console.log(`SUCCESS : message sent`);
        }

        if (error.httpStatus === 404) {
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );

            await channel.send(embededMsg);

            console.log(`SUCCESS : message sent`);
        }
    }
};

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.channels.fetch(DISCORD_CHANNEL_ID).then(async (channel) => {
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

client.login(DISCORD_TOKEN);
