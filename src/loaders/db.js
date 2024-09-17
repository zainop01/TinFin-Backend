const mongoose = require("mongoose");
// config
const config = require("../config/config");

module.exports = function () {
    mongoose.set("strictQuery", false);
  mongoose
    .connect(config.db)
    .then(() => console.log(" MongoDB Connected!"))
    .catch((error) => {
      console.error(error);
    });
};
