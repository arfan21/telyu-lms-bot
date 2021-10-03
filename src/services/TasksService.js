const Tugas = require("../model/Tugas");
const TugasLab = require("../model/TugasLab");
const notificationTask = require("../TemplateMessage/notificationTask");

const { DISCORD_CHANNEL_STREAM_ID, DISCORD_KELAS_ROLE, DISCORD_CHANNEL_ID } =
    process.env;

module.exports = {
    InsertTasks: async (data) => {
        try {
            const promises = [];
            data.forEach(async (item) => {
                const tugas = {};
                tugas.matkul = item.course.fullname;
                tugas.tugas = item.name;
                tugas.link = item.url;
                tugas.deadline = new Date(item.timestart * 1000);
                console.log("Insert task ->", tugas.matkul);

                promises.push(
                    Tugas.findOneAndUpdate(
                        { matkul: tugas.matkul, tugas: tugas.tugas },
                        tugas,
                        { upsert: true }
                    )
                );
            });
            await Promise.all(promises);
            console.log("data tasks inserted");
        } catch (error) {
            return error;
        }
    },
    GetTasks: async () => {
        try {
            const data = await Tugas.find({
                deadline: { $gte: new Date() },
            }).sort({ deadline: 1 });

            console.log("success get all tasks");

            return data;
        } catch (error) {
            return error;
        }
    },
    WatchTasks: async (client) => {
        console.log("watch db tasks started");

        const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);

        Tugas.watch().on("change", (event) => {
            console.log(`tugas activty : ${event.operationType}`);
            if (event.operationType === "insert") {
                const insertedData = event.fullDocument;

                if (insertedData.matkul.includes("IF-44-06")) {
                    channel.send(
                        notificationTask(
                            "605483117100269616", // id discord firsta
                            DISCORD_CHANNEL_ID,
                            insertedData.matkul,
                            insertedData.tugas
                        )
                    );
                    return;
                }
                channel.send(
                    notificationTask(
                        DISCORD_KELAS_ROLE,
                        DISCORD_CHANNEL_ID,
                        insertedData.matkul,
                        insertedData.tugas
                    )
                );
            }
        });
    },
    InsertTasksLab: async (data) => {
        try {
            if (data) {
                console.log("Insert task lab ->", data.title);
                await TugasLab.findOneAndUpdate(
                    {
                        title: data.title,
                        link_halaman: data.link_halaman,
                    },
                    data,
                    {
                        upsert: true,
                    }
                );
                console.log("tugas lab inserted");
            } else {
                throw new Error("tugas lab data null");
            }
        } catch (error) {
            console.log("InsertTasksLab: ", error);
            return error;
        }
    },
    GetTasksLab: async () => {
        const timeNowMin = new Date();
        timeNowMin.setDate(timeNowMin.getDate() - 5);

        try {
            const data = await TugasLab.findOne({
                date: { $gte: timeNowMin },
            });

            console.log("success get all tasks lab");

            return data;
        } catch (error) {
            return error;
        }
    },
    WatchTasksLab: async (client) => {
        console.log("watch db tasks lab started");
        const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);

        TugasLab.watch().on("change", (event) => {
            console.log(`TugasLab activty : ${event.operationType}`);
            if (event.operationType === "insert") {
                const insertedData = event.fullDocument;

                channel.send(
                    `<@&${DISCORD_KELAS_ROLE}>\n${new Date().toLocaleString(
                        "id-ID",
                        {
                            timeZone: "Asia/Jakarta",
                        }
                    )} : ada tugas baru ***LAB PBO : ${
                        insertedData.title
                    }***. cek channel <#${DISCORD_CHANNEL_ID}>`
                );
            }
        });
    },
};
