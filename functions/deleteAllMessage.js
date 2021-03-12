module.exports = async (channel) => {
    let msg = await channel.messages.fetch();
    msg.map((msg) => {
        msg.delete();
    });
};
