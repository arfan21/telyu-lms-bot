const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readSession = require("./readSession");

module.exports = async (key, rawData) => {
    const sessiondir = path.join(__dirname, "/./../../session.json");
    const writeFileAsync = promisify(fs.writeFile);
    try {
        const sessions = await readSession();

        if (!sessions) {
            const newSession = {};
            newSession[key] = rawData;
            const rawjson = JSON.stringify(newSession);

            await writeFileAsync(sessiondir, rawjson);
        } else {
            sessions[key] = rawData;
            const rawjson = JSON.stringify(sessions);

            await writeFileAsync(sessiondir, rawjson);
            return;
        }
    } catch (error) {
        console.log("WriteSession: ", error);
        return error;
    }
};
