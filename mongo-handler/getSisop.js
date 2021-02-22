const Sisop = require("../models/Sisop");
const insertSisop = require("./insertSisop");

module.exports = async () => {
    const timeNowMin = new Date();
    timeNowMin.setDate(timeNowMin.getDate() - 5);
    return new Promise(async (resolve, reject) => {
        const wrapper = async (n) => {
            try {
                const sisop = await Sisop.findOne({
                    date: { $gte: timeNowMin },
                });

                if (!sisop) {
                    if (n > 0) {
                        throw new Error("not found");
                    } else {
                        resolve(sisop);
                    }
                }

                resolve(sisop);
            } catch (error) {
                if (n > 0) {
                    console.log(`getSisop: retrying, attempt number ${n}`);
                    await insertSisop();
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
