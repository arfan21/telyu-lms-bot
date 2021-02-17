module.exports = async (channel) => {
    const promises = [];
    let msg = await channel.messages.fetch();
    msg.map((msg) => {
        promises.push(msg.delete());
    });
    Promise.all(promises);
};
