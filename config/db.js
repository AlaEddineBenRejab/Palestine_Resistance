const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const databaseName = process.env.DBNAME;
const databaseURL = process.env.DBURL;
mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const connectDb = () => {
  mongoose.set("debug", false);
  mongoose
    .connect(`mongodb://${databaseURL}/${databaseName}`)
    .then(() => {
      console.log(`Connected to database`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connectDb };
