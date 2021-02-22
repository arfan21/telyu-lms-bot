const cron = require("node-cron");
const sendMessageToChannel = require("./sendMessageToChannel");
const { TIME_SCHEDULE } = process.env;

module.exports = (channel, client) => {
    cron.schedule(
        TIME_SCHEDULE,
        async () => await sendMessageToChannel(channel, client),
        {
            timezone: "Asia/Jakarta",
        }
    );
    console.log("starting cron job");
};
