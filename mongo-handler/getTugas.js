const Tugas = require("../models/Tugas");

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await Tugas.find({
                deadline: { $gte: new Date() },
            }).sort({ deadline: 1 });
            console.log("success get tugas");
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};
