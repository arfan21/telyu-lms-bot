const deleteAllMessage = require("./deleteAllMessage");
const embedMessage = require("./embedMessage");

const { DISCORD_CHANNEL_ID } = process.env;

module.exports = async (channel, client) => {
    console.log(
        `${new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
        })} START: sending message to channel : ${DISCORD_CHANNEL_ID}`
    );
    const channelName = channel.name;
    const lastMessageID = channel.lastMessageID;
    const { embed, banyak_tugas_lms } = await embedMessage();

    client.user.setActivity(
        `LMS Ada ${banyak_tugas_lms} Tugas|cek channel ${channelName}`
    );

    if (lastMessageID === null) {
        await channel.send(embed);

        console.log(
            `${new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })} SUCCESS : message sent`
        );
    }
    try {
        let msg = await channel.messages.fetch(lastMessageID);
        await msg.edit(embed);

        console.log(
            `${new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })} SUCCESS : message sent`
        );
    } catch (error) {
        console.log(`ERROR : sending message to channel : ${error.message}`);

        if (error.httpStatus === 403) {
            await deleteAllMessage(channel);
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );

            await channel.send(embed);

            console.log(`SUCCESS : message sent`);
        }

        if (error.httpStatus === 404) {
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );

            await channel.send(embed);

            console.log(`SUCCESS : message sent`);
        }
    }
};
