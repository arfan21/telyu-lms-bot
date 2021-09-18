module.exports = (DISCORD_KELAS_ROLE, DISCORD_CHANNEL_ID, matkul, tugas) => {
    return `<@&${DISCORD_KELAS_ROLE}>\n${new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
    })} => Ada tugas baru ***${matkul}: ${tugas}***\nCek channel <#${DISCORD_CHANNEL_ID}>`;
};
