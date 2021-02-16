const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TugasSchema = new schema({
    matkul: {
        type: String,
        required: true,
    },
    tugas: {
        type: String,
        required: true,
        unique: true,
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("tugas", TugasSchema);
