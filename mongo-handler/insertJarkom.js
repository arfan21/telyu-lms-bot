const getTugasJarkom = require("../helpers/getTugasJarkom");
const Jarkom = require("../models/Jarkom");
module.exports = async () => {
    try {
        const dataJarkom = await getTugasJarkom();
        if (dataJarkom) {
            await Jarkom.findOneAndUpdate(
                {
                    title: dataJarkom.title,
                    link_halaman: dataJarkom.link_halaman,
                },
                dataJarkom,
                {
                    upsert: true,
                }
            );
            console.log("tugas lab inserted");
        }
    } catch (error) {
        console.log("insert", error);
    }
};
