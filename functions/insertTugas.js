const Tugas = require("../models/Tugas");

module.exports = async (data) => {
    const promises = [];
    data.forEach(async (item) => {
        const tugas = {};
        tugas.matkul = item.course.fullname;
        tugas.tugas = item.name;
        tugas.link = item.url;
        tugas.deadline = new Date(item.timestart * 1000);

        promises.push(Tugas.findOneAndUpdate(tugas, tugas, { upsert: true }));
    });
    Promise.all(promises)
        .then((res) => {
            console.log("data inserted");
        })
        .catch((error) => {
            console.log(error.message);
        });
};
