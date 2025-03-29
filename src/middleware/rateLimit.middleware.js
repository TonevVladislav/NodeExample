const { rateLimit } = require("express-rate-limit");
const {
  RATE_LIMITER_WINDOW_MS,
  RATE_LIMITER_LIMIT,
} = require("../config/index.js");

const limiter = rateLimit({
  windowMs: RATE_LIMITER_WINDOW_MS,
  limit: RATE_LIMITER_LIMIT,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = { limiter };
