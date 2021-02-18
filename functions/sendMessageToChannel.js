const deleteAllMessage = require("./deleteAllMessage");
const embedMessage = require("./embedMessage");

const { DISCORD_CHANNEL_ID } = process.env;

module.exports = async (channel, client) => {
    const channelName = channel.name;
    const lastMessageID = channel.lastMessageID;
    const embededMsg = await embedMessage();
    const embededMsgFieldsLenght = embededMsg.fields.length;

    client.user.setActivity(
        `LMS Ada ${embededMsgFieldsLenght} Tugas|cek channel ${channelName}`
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
