const fs = require("fs");
module.exports = async (rawdata) => {
    try {
        const rawjson = JSON.stringify(rawdata);
        fs.writeFileSync("../session.json", rawjson, { flag: "w" });
        console.log("session saved");
        return;
    } catch (error) {
        console.log("WriteSession: ", error);
        return error;
    }
};
