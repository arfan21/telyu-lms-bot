const fs = require("fs");
const getLMSsession = require("./getLMSsession");

module.exports = async () => {
    try {
        const rawdata = await getLMSsession();
        const rawjson = JSON.stringify(rawdata);

        fs.appendFileSync("session.json", rawjson);
        console.log("session saved");
    } catch (error) {
        console.log(error);
    }
};
