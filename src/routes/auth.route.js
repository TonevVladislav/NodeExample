const express = require("express");

const {
  login,
  register,
  refreshToken,
  logout,
} = require("../controllers/auth.controller.js");
const { limiter } = require("../middleware/rateLimit.middleware.js");
const { authMiddleware } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.post("/refresh", limiter, authMiddleware, refreshToken);
router.post("/logout", limiter, logout);

module.exports = router;
