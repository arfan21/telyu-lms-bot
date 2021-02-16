const Discord = require("discord.js");
const readSession = require("../configs/readSession");
const fetchActivity = require("./fetchActivity");
const getTugas = require("./getTugas");
const insertTugas = require("./insertTugas");

const session = readSession();

module.exports = async () => {
    console.log("sending message ....");
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor("Tugas IF-43-12", "https://i.imgur.com/wSTFkRM.png")
        .setTimestamp()
        .setFooter("Last updated", "https://i.imgur.com/wSTFkRM.png");

    try {
        data = await fetchActivity(
            session.sesskey,
            session.moodlesession.value
        );

        const listActions = data.data.events;
        await insertTugas(listActions);

        const dataDB = await getTugas();
        dataDB.forEach((item) => {
            const timeLocal = item.deadline.toLocaleString("id-ID");

            exampleEmbed.addField(
                item.matkul,
                `[${item.tugas}](${item.link})\n${timeLocal}`,
                true
            );
        });
    } catch (error) {
        console.log(error);
        if (error.error) {
        }
    }
    console.log("message sended ....");
    return exampleEmbed;
};
