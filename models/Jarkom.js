const mongoose = require("mongoose");
const schema = mongoose.Schema;

const JarkomSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    link_halaman: {
        type: String,
        required: true,
    },
    link_soal: {
        type: String,
        required: true,
    },
    link_pengumpulan: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("jarkom", JarkomSchema);
