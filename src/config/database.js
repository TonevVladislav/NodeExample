const mongoose = require("mongoose");
const { logger } = require("../utils/logger.util");
require("../db/models/User");
//TODO change database

//TODO change database
//const connectionString = `mongodb://localhost:27017/${dbName}`;
const connectionString = `mongodb://localhost/${process.env.dbName}`;

module.exports = async (app) => {
  try {
    mongoose.connect(connectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //autoIndex: false,
    });
    console.log("Database connected");

    mongoose.connection.on("error", (err) => {
      console.error("Database error");
      logger.error(err);
    });
  } catch (err) {
    console.error("Error connecting to database");
    logger.error(err);
    process.exit(1);
  }
};
