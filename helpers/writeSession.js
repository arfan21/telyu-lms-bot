const fs = require("fs");
const getLMSsession = require("./getLMSsession");

module.exports = async () => {
    try {
        const rawdata = await getLMSsession();
        const rawjson = JSON.stringify(rawdata);
        fs.writeFileSync("session.json", rawjson, { flag: "w" });
        console.log("session saved");
    } catch (error) {
        console.log(error);
    }
};
