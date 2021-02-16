const fs = require("fs");

module.exports = () => {
    let rawdata = fs.readFileSync("session.json");
    return JSON.parse(rawdata);
};
