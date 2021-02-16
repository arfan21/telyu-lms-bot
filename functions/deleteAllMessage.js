module.exports = async (channel) => {
    let msg = await channel.messages.fetch();
    msg.map(async (msg) => {
        await msg.delete();
    });
};
