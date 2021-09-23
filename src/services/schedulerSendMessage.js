const cron = require("node-cron");
const path = require("path");
const deleteAllMessageInChannel = require("../helpers/deleteAllMessageInChannel");
const getTasksFromWeb = require("../scraper/LmsTelkomUniv/getTasksFromWeb");
const embedMsgListTasks = require("../TemplateMessage/embedMsgListTasks");
const TasksService = require("./TasksService");
require("dotenv").config({ path: path.join(__dirname, "/./../../.env") });

const { TIME_SCHEDULE, DISCORD_CHANNEL_ID } = process.env;

module.exports = async (channel, client) => {
    cron.schedule(
        TIME_SCHEDULE,
        () => {
            send(channel, client);
        },
        {
            timezone: "Asia/Jakarta",
        }
    );
    console.log("starting cron job");
};

const send = async (client) => {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID, {
        cache: true,
        force: true,
    });

    console.log(
        `${new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
        })} START: sending message to channel : ${DISCORD_CHANNEL_ID}`
    );
    const channelName = channel.name;
    const lastMessageID = channel.lastMessageId;
    console.log("last ID ====>", lastMessageID);
    try {
        // const tasksLms = await getTasksFromWeb();
        // if (tasksLms) {
        //     const listTask = tasksLms.data.events;
        //     await TasksService.InsertTasks(listTask);
        // }

        // const listTasks = await TasksService.GetTasks();
        var embedMsg = embedMsgListTasks(null);

        // client.user.setActivity(
        //     `LMS Ada ${listTasks.length} Tugas|cek channel ${channelName}|play music gunakan /play (pilih yang telyu LeMeS)`
        // );

        if (lastMessageID === null) {
            await channel.send({ embeds: [embedMsg] });

            console.log(
                `${new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                })} SUCCESS : message sent`
            );
        }

        let msg = await channel.messages.fetch(lastMessageID);
        await msg.edit({ embeds: [embedMsg] });

        console.log(
            `${new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })} SUCCESS : message embed edited`
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

            await channel.send({ embeds: [embedMsg] });

            console.log(`SUCCESS : message sent`);
        }

        if (error.httpStatus === 404) {
            deleteAllMessageInChannel(channel);
            console.log(
                `RETRY : sending message to channel : ${DISCORD_CHANNEL_ID}`
            );
            await channel.send({ embeds: [embedMsg] });

            console.log(`SUCCESS : message sent`);
        }
    }
};
