const fs = require("fs");
const path = require("path");

module.exports = async () => {
    const accountdir = path.join(__dirname, "/./../../account.json");
    try {
        let rawdata = fs.readFileSync(accountdir);

        return JSON.parse(rawdata);
    } catch (error) {
        return error;
    }
};
