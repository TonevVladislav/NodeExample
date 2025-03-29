const {
  createAccount,
  signIn,
  refreshTokens,
} = require("../services/auth.services.js");
const { StatusCodes } = require("http-status-codes");
const { logger } = require("../utils/logger.util.js");

const register = async (req, res) => {
  const user = await createAccount(
    req.body.email,
    req.body.password,
    req.body.username
  ).catch((err) => {
    logger.info(err.toString());
    res.status(StatusCodes.BAD_REQUEST).json(err.toString());
  });
  res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
  const { accessToken, refreshToken, user } = await signIn(
    req.body.email,
    req.body.password
  ).catch((err) => {
    logger.info(err);
    res.status(StatusCodes.BAD_REQUEST).json(err.toString());
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info("Sign in controller: Successful login");
  res.status(200).json({ accessToken, refreshToken, user });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.headers.cookie.replace("refreshToken=", "");
  if (!refreshToken)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Refresh token required" });

  const tokens = await refreshTokens(refreshToken).catch((err) => {
    logger.info(err);
  });
  res.status(200).json(tokens);
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST);
  }
};

module.exports = { login, register, refreshToken, logout };
