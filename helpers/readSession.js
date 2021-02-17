const fs = require("fs");

module.exports = async () => {
    try {
        let rawdata = fs.readFileSync("session.json");
        if (rawdata.length > 0) {
            return JSON.parse(rawdata);
        }
        return {
            session: "",
            moodlesession: {},
        };
    } catch (error) {
        return {
            session: "",
            moodlesession: {},
        };
    }
};
