const Discord = require("discord.js");

module.exports = (tasks) => {
    const tick = new Date().getMinutes();
    const discordEmbedMsg = new Discord.MessageEmbed();
    discordEmbedMsg.setColor("#0099ff");
    discordEmbedMsg.setAuthor(
        "Tugas IF-43-12 LMS dan LAB",
        "https://i.imgur.com/wSTFkRM.png"
    );
    discordEmbedMsg.setTimestamp();
    discordEmbedMsg.setFooter(
        `${tick % 2 === 0 ? "⚪" : "⚫"} Last updated`,
        "https://i.imgur.com/wSTFkRM.png"
    );

    tasks?.forEach((task) => {
        const timeLocal = task.deadline.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
        });

        discordEmbedMsg.addField(
            task.matkul,
            `[${task.tugas}](${task.link})\n${timeLocal}`,
            true
        );
    });

    discordEmbedMsg.addField("\u200B", "\u200B", false);

    return discordEmbedMsg;
};
