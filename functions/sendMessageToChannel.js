const deleteAllMessage = require("./deleteAllMessage");
const embedMessage = require("./embedMessage");

const { DISCORD_CHANNEL_ID } = process.env;

module.exports = async (channel, client) => {
    const channelName = channel.name;
    const lastMessageID = channel.lastMessageID;
    const { embed, banyak_tugas_lms } = await embedMessage();

    client.user.setActivity(
        `LMS Ada ${banyak_tugas_lms} Tugas|cek channel ${channelName}`
    );

    if (lastMessageID === null) {
        console.log(`sending message to channel : ${DISCORD_CHANNEL_ID}`);

        await channel.send(embed);

        console.log(`SUCCESS : message sent`);
    }
    try {
        console.log(`sending message to channel : ${DISCORD_CHANNEL_ID}`);

        let msg = await channel.messages.fetch(lastMessageID);

        await msg.edit(embed);

        console.log(`SUCCESS : message sent`);
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
