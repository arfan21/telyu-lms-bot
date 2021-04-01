const fs = require("fs");
const getLMSsession = require("./getLMSsession");

module.exports = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const rawdata = await getLMSsession();
            const rawjson = JSON.stringify(rawdata);
            fs.writeFileSync("session.json", rawjson, { flag: "w" });
            console.log("session saved");
            resolve("session saved");
        } catch (error) {
            console.log("WriteSession: ", error);
            reject(error);
        }
    });
};
