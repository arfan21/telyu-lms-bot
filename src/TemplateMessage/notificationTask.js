module.exports = (DISCORD_KELAS_ROLE, DISCORD_CHANNEL_ID, matkul, tugas) => {
    if (DISCORD_KELAS_ROLE === "605483117100269616") {
        return `<@${DISCORD_KELAS_ROLE}>\n${new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
        })} => Ada tugas baru ***${matkul}: ${tugas}***\nCek channel <#${DISCORD_CHANNEL_ID}>`;
    } else {
        return `<@&${DISCORD_KELAS_ROLE}>\n${new Date().toLocaleString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
            }
        )} => Ada tugas baru ***${matkul}: ${tugas}***\nCek channel <#${DISCORD_CHANNEL_ID}>`;
    }
};
