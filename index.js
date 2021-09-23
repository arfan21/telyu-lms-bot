const dotenv = require("dotenv");
const path = require("path");
const { SlashCreator, GatewayServer } = require("slash-create");
const { Client } = require("discord.js");
const { Player } = require("discord-player");
const { registerPlayerEvents } = require("./events");

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

// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);

//     console.log('Generating docs...');
//     generateDocs(creator.commands);
// });

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
const schedulerSendMessage = require("./src/services/schedulerSendMessage");
const cron = require("node-cron");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
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

    schedulerSendMessage(client);
    cron.schedule(
        "*/3 * * * * *",
        async () => {
            try {
                const channel = await client.channels.fetch(
                    process.env.DISCORD_CHANNEL_ID,
                    {
                        cache: true,
                        force: true,
                    }
                );
                const tick = new Date().getSeconds();
                const lastMessageID = channel.lastMessageId;
                const lastMsg = await channel.messages.fetch(lastMessageID);
                const embed = lastMsg.embeds[0];

                embed.footer.text = `${
                    tick % 2 === 0 ? "⚪" : "⚫"
                } Last updated`;
                lastMsg.edit({ embeds: [embed] });
            } catch (error) {
                console.log(error.message);
            }
        },
        {
            timezone: "Asia/Jakarta",
        }
    );
});
