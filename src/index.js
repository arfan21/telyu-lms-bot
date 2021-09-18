const mongoose = require("mongoose");
const InitDiscord = require("./services/DiscordService");
require("dotenv").config();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

InitDiscord();
