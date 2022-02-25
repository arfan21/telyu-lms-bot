const cron = require("node-cron");
const path = require("path");
const deleteAllMessageInChannel = require("../helpers/deleteAllMessageInChannel");
const getTasksFromWeb = require("../scraper/LmsTelkomUniv/getTasksFromWeb");
const getTasksLab = require("../scraper/LmsTelkomUniv/getTasksLab");
const embedMsgListTasks = require("../TemplateMessage/embedMsgListTasks");
const TasksService = require("./TasksService");
require("dotenv").config({ path: path.join(__dirname, "/./../../.env") });

const { TIME_SCHEDULE, DISCORD_CHANNEL_ID } = process.env;

const schedulerSendMessage = async (client) => {
    cron.schedule(
        TIME_SCHEDULE,
        () => {
            sendMessage(client);
        },
        {
            timezone: "Asia/Jakarta",
        }
    );
    console.log("starting cron job");
};

const sendMessage = async (client) => {
    try {
        var channel = await client.channels.fetch(DISCORD_CHANNEL_ID, {
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

        const tasksLms = await getTasksFromWeb();
        if (tasksLms) {
            await TasksService.InsertTasks(tasksLms);
        }

        const tasksLab = await getTasksLab();
        if (tasksLab) {
            await TasksService.InsertTasksLab(tasksLab);
        }

        const [listTasks, listTasksLab] = await Promise.all([
            TasksService.GetTasks(),
            TasksService.GetTasksLab(),
        ]);

        var embedMsg = embedMsgListTasks(listTasks, listTasksLab);

        client.user.setActivity(
            `LMS Ada ${listTasks.length} Tugas|cek channel ${channelName}|play music gunakan /play (pilih yang telyu LeMeS)`
        );

        if (lastMessageID === null) {
            await channel.send({ embeds: [embedMsg] });

            console.log(
                `${new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                })} SUCCESS : message sent`
            );

            return;
        }

        let msg = await channel.messages.fetch(lastMessageID, {
            cache: true,
            force: true,
        });
        embedMsg.setTimestamp();
        await msg.edit({ embeds: [embedMsg] });
        console.log(
            `${new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })} SUCCESS : EDIT Embeds message`
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

module.exports = { schedulerSendMessage, sendMessage };
