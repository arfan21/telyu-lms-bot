const Discord = require("discord.js");
const schedulerSendMessage = require("./schedulerSendMessage");
const { DISCORD_TOKEN, DISCORD_CHANNEL_ID } = process.env;

const InitDiscord = () => {
    const client = new Discord.Client();
    client.on("message", (msg) => {
        if (msg.content === "ping") {
            msg.reply("pong");
        }
    });

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.channels.fetch(DISCORD_CHANNEL_ID).then(async (channel) => {
            schedulerSendMessage(channel, client);

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

    client.login(DISCORD_TOKEN);
};

module.exports = InitDiscord;
