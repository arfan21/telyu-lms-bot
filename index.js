require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const shceduler = require("./functions/shceduler");
const mongoUri = require("./mongoUri");
const client = new Discord.Client();

const { DISCORD_TOKEN, DISCORD_CHANNEL_ID } = process.env;

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
        shceduler(channel, client);
    });
});

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(DISCORD_TOKEN);
