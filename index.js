require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const shceduler = require("./functions/shceduler");
const mongoUri = require("./mongoUri");
const client = new Discord.Client();
const cron = require("node-cron");
const tugasStream = require("./mongo-handler/tugasStream");
const jarkomStream = require("./mongo-handler/jarkomStream");

const { DISCORD_TOKEN, DISCORD_CHANNEL_ID } = process.env;

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
    tugasStream(client);
    jarkomStream(client);
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.fetch(DISCORD_CHANNEL_ID).then(async (channel) => {
        shceduler(channel, client);

        cron.schedule(
            "*/3 * * * * *",
            async () => {
                try {
                    const tick = new Date().getSeconds();
                    const lastMessageID = channel.lastMessageID;
                    const msg = await channel.messages.fetch(lastMessageID);
                    const embed = msg.embeds[0];
                    embed.footer.text = `${
                        tick % 2 === 0 ? "⚪" : "⚫"
                    } Last updated`;
                    msg.edit(embed);
                } catch (error) {
                    console.log(error.message);
                }
            },
            {
                timezone: "Asia/Jakarta",
            }
        );
    });
});

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(DISCORD_TOKEN);
