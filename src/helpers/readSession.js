const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

module.exports = async () => {
    const sessiondir = path.join(__dirname, "/./../../session.json");
    const readFileAsync = promisify(fs.readFile);
    try {
        let rawdata = await readFileAsync(sessiondir);
        let data = JSON.parse(rawdata);

        return data;
    } catch (error) {
        console.log("ReadSession: ", error);
        return null;
    }
};
