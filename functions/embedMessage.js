const Discord = require("discord.js");
const fetchActivity = require("./fetchActivity");
const getTugas = require("./getTugas");
const insertTugas = require("./insertTugas");

module.exports = async () => {
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor("Tugas IF-43-12 LMS Only", "https://i.imgur.com/wSTFkRM.png")
        .setTimestamp()
        .setFooter("Last updated", "https://i.imgur.com/wSTFkRM.png");

    try {
        data = await fetchActivity();

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
    }
    return exampleEmbed;
};
