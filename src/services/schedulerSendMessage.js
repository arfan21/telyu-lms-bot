const cron = require("node-cron");
const deleteAllMessageInChannel = require("../helpers/deleteAllMessageInChannel");
const getTasksFromWeb = require("../scraper/LmsTelkomUniv/getTasksFromWeb");
const embedMsgListTasks = require("../TemplateMessage/embedMsgListTasks");
const TasksService = require("./TasksService");
const { TIME_SCHEDULE } = process.env;

module.exports = async (channel, client) => {
    cron.schedule(
        TIME_SCHEDULE,
        async () => {
            await send(channel, client);
        },
        {
            timezone: "Asia/Jakarta",
        }
    );
    console.log("starting cron job");
};

const send = async (channel, client) => {
    console.log(
        `${new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
        })} START: sending message to channel : ${DISCORD_CHANNEL_ID}`
    );
    const channelName = channel.name;
    const lastMessageID = channel.lastMessageID;

    const tasksLms = await getTasksFromWeb();
    if (tasksLms) {
        const listTask = tasksLms.data.events;
        await TasksService.InsertTasks(listTask);
    }

    const listTasks = await TasksService.GetTasks();
    const embedMsg = embedMsgListTasks(listTasks);

    client.user.setActivity(
        `LMS Ada ${listTasks.length} Tugas|cek channel ${channelName}`
    );

    if (lastMessageID === null) {
        await channel.send(embedMsg);

        console.log(
            `${new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })} SUCCESS : message sent`
        );
    }
    try {
        let msg = await channel.messages.fetch(lastMessageID);
        await msg.edit(embedMsg);

        console.log(
            `${new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })} SUCCESS : message sent`
        );
    } catch (error) {
        console.log(
            `ERROR : sending message to channel -> ${error.httpStatus} | ${error.message}`
        );

        if (error.httpStatus === 403) {
            deleteAllMessageInChannel(channel);
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );

            await channel.send(embedMsg);

            console.log(`SUCCESS : message sent`);
        }

        if (error.httpStatus === 404) {
            deleteAllMessageInChannel(channel);
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );

            await channel.send(embedMsg);

            console.log(`SUCCESS : message sent`);
        }
    }
};
