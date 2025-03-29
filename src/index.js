const dotenv = require("dotenv");
const databaseConfig = require("./config/database.js");
const app = require("./app.js");
// const logger = require("./utils/logger.util.js");

databaseConfig(app);

dotenv.config();

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, async () => {
  // logger.info(`Express server started on port ${PORT}`);
  console.log(`Express server started on port ${PORT}`);
});

module.exports = server;
