require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const sendMessageToChannel = require("./functions/sendMessageToChannel");
const mongoUri = require("./mongoUri");
const client = new Discord.Client();

const {
    DISCORD_TOKEN,
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

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.channels.fetch(DISCORD_CHANNEL_ID).then(async (channel) => {
        await sendMessageToChannel(channel, client);
        setInterval(async () => {
            await sendMessageToChannel(channel, client);
        }, timeInterval);
    });
});

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(DISCORD_TOKEN);
