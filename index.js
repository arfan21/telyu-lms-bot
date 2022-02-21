const dotenv = require("dotenv");
const path = require("path");
const { SlashCreator, GatewayServer } = require("slash-create");
const { Client } = require("discord.js");
const { Player } = require("discord-player");
const { registerPlayerEvents } = require("./events");
const { generateDocs } = require("./docs");

dotenv.config();

const client = new Client({
    intents: ["GUILDS", "GUILD_VOICE_STATES"],
});

client.player = new Player(client);
registerPlayerEvents(client.player);

const creator = new SlashCreator({
    applicationID: process.env.DISCORD_CLIENT_ID,
    token: process.env.DISCORD_CLIENT_TOKEN,
});

creator
    .withServer(
        new GatewayServer((handler) =>
            client.ws.on("INTERACTION_CREATE", handler)
        )
    )
    .registerCommandsIn(path.join(__dirname, "commands"));

if (process.env.DISCORD_GUILD_ID)
    creator.syncCommandsIn(process.env.DISCORD_GUILD_ID);
else creator.syncCommands();

client.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports.client = client;
module.exports.creator = creator;

const mongoUri = require("./mongoUri");
const mongoose = require("mongoose");
const cron = require("node-cron");
const TasksService = require("./src/services/TasksService");
const {
    schedulerSendMessage,
    sendMessage,
} = require("./src/services/schedulerSendMessage");

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log("mongoDB Connected");
        sendMessage(client);
        TasksService.WatchTasks(client);
        TasksService.WatchTasksLab(client);
        schedulerSendMessage(client);
    } catch (error) {
        console.log(error.message);
    }
});
