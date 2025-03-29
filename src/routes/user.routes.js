const express = require("express");

const {
  getUser,
  updateUser,
  recoverPassword,
} = require("../controllers/user.controller.js");
const { limiter } = require("../middleware/rateLimit.middleware.js");
const { authMiddleware } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, limiter, getUser);
router.put("/:id", authMiddleware, limiter, updateUser);
router.put("/:id/password", authMiddleware, limiter, recoverPassword);
module.exports = router;
