const express = require("express");

const {
  getTransactions,
  startIndexing,
  getEvents,
  stopIndexing,
} = require("../controllers/eth.controller.js");

const { limiter } = require("../middleware/rateLimit.middleware.js");

const router = express.Router();

router.get("/address/:address/transactions", limiter, getTransactions);
router.post("/contracts/:address/watch", limiter, startIndexing);
router.get("/contracts/:address/events", limiter, getEvents);
router.delete("/contracts/:address/watch", limiter, stopIndexing);
module.exports = router;
