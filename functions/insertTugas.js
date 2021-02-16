const Tugas = require("../models/Tugas");

module.exports = async (data) => {
    try {
        data.forEach(async (item) => {
            const tugas = {};
            tugas.matkul = item.course.fullname;
            tugas.tugas = item.name;
            tugas.link = item.url;
            tugas.deadline = new Date(item.timestart * 1000);

            await Tugas.findOneAndUpdate(tugas, tugas, { upsert: true });
        });
        console.log("data inserted");
    } catch (error) {
        console.log(error.message);
    }
};
