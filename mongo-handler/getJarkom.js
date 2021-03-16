const Jarkom = require("../models/Jarkom");
const insertJarkom = require("./insertJarkom");

module.exports = async () => {
    const timeNowMin = new Date();
    timeNowMin.setDate(timeNowMin.getDate() - 5);

    return new Promise(async (resolve, reject) => {
        const wrapper = async (n) => {
            try {
                const jarkom = await Jarkom.findOne({
                    date: { $gte: timeNowMin },
                });

                if (!jarkom) {
                    if (n > 0) {
                        throw new Error("not found");
                    } else {
                        resolve(jarkom);
                    }
                }

                resolve(jarkom);
            } catch (error) {
                if (n > 0) {
                    console.log(`getJarkom: retrying, attempt number ${n}`);
                    await insertJarkom();
                    n = n - 1;
                    wrapper(n);
                } else {
                    reject(error);
                }
            }
        };

        await wrapper(3);
    });
};
