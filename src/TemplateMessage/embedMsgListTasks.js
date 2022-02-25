const Discord = require("discord.js");

module.exports = (tasks, tasksLab) => {
    const discordEmbedMsg = new Discord.MessageEmbed();

    discordEmbedMsg.setColor("#0099ff");
    discordEmbedMsg.setAuthor(
        "Tugas Warga IF-43-12 LMS tapi kelasnya beda2 :v dan LAB",
        "https://i.imgur.com/wSTFkRM.png"
    );
    discordEmbedMsg.setTimestamp();
    discordEmbedMsg.setFooter(
        `⚪ Last updated`,
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

    if (tasksLab) {
        discordEmbedMsg.addField(
            "TUGAS LAB PBO",
            `[sumber website lab informatika](https://informatics.labs.telkomuniversity.ac.id/category/praktikum/pbo/)\n\n[${
                tasksLab.title
            }](${tasksLab.link_halaman})\n[Soal Tugas](${
                tasksLab.link_soal
            })\nCreated at ${tasksLab.date.toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                dateStyle: "medium",
            })}`,
            true
        );
    }

    return discordEmbedMsg;
};
