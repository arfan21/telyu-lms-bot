const getTugasSisop = require("../helpers/getTugasSisop");
const Sisop = require("../models/Sisop");

module.exports = async () => {
    const dataSisop = await getTugasSisop();

    try {
        if (dataSisop) {
            await Sisop.findOneAndUpdate(dataSisop, dataSisop, {
                upsert: true,
            });
            console.log("tugas lab inserted");
        }
    } catch (error) {
        console.log("insert", error);
    }
};
