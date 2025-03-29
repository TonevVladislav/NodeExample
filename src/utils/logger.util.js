const winston = require("winston");
const path = require("path");

const ERROR_LOG_FILE = path.resolve(__dirname, "../../logs/error.log");
const COMBINED_LOG_FILE = path.resolve(__dirname, "../../logs/combined.log");
const INDEXER_LOG_FILE = path.resolve(__dirname, "../../logs/indexer.log");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: ERROR_LOG_FILE, level: "error" }),
    new winston.transports.File({
      filename: INDEXER_LOG_FILE,
      level: "indexer",
    }),
    new winston.transports.File({ filename: COMBINED_LOG_FILE }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
}

module.exports = { logger };
