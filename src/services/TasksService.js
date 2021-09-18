const Tugas = require('../../models/Tugas');
const notificationTask = require('../TemplateMessage/notificationTask');

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

                promises.push(
                    Tugas.findOneAndUpdate(
                        { matkul: tugas.matkul, tugas: tugas.tugas },
                        tugas,
                        { upsert: true },
                    ),
                );
            });
            await Promise.all(promises);
            console.log('data tasks inserted');
        } catch (error) {
            return error;
        }
    },
    GetTasks: async () => {
        try {
            const data = await Tugas.find({
                deadline: { $gte: new Date() },
            }).sort({ deadline: 1 });

            console.log('success get all tasks');

            return data;
        } catch (error) {
            return error;
        }
    },
    WatchTasks: async (client) => {
        const {
            DISCORD_CHANNEL_STREAM_ID,
            DISCORD_KELAS_ROLE,
            DISCORD_CHANNEL_ID,
        } = process.env;

        const channel = await client.channels.fetch(DISCORD_CHANNEL_STREAM_ID);

        Tugas.watch().on('change', (event) => {
            console.log(`tugas activty : ${event.operationType}`);
            if (event.operationType === 'insert') {
                const insertedData = event.fullDocument;

                channel.send(
                    notificationTask(
                        DISCORD_KELAS_ROLE,
                        DISCORD_CHANNEL_ID,
                        insertedData.matkul,
                        insertedData.tugas,
                    ),
                );
            }
        });
    },
};
