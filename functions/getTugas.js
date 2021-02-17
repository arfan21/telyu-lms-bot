const Tugas = require("../models/Tugas");

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        const date = new Date();
        // const dateUnix = (date.getTime() / 1000).toFixed(0);
        try {
            const data = await Tugas.find({
                deadline: { $gte: new Date() },
            }).sort({ deadline: 1 });
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};
