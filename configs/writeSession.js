const fs = require("fs");

module.exports = (rawdata) => {
    let rawjson = JSON.stringify(rawdata);
    fs.writeFileSync("session.json", rawjson);
};
