const User = require("../db/models/User");
const { hash, compare } = require("bcrypt");
const { getUserByEmail } = require("./user.services");
const { generateTokens } = require("../utils/tokens.util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/error.handler.util");

async function createAccount(email, password, username) {
  const user = await getUserByEmail(email);

  if (user) {
    throw new AppError("User already exists!");
  }
  const hashedPassword = await hash(password, 10);
  user = new User({
    email,
    hashedPassword,
    username,
  });
  await user.save();
  return user;
}

async function signIn(email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError("Incorrect email or password");
  }

  const hashMatch = await compare(password, user.hashedPassword);
  if (!hashMatch) {
    throw new AppError("Incorrect email or password");
  } else {
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken, user };
  }
}

async function refreshTokens(oldToken) {
  try {
    const decoded = jwt.verify(oldToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== oldToken)
      throw new AppError("Invalid refresh token");

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new AppError("Token expired or invalid");
  }
}

module.exports = {
  createAccount,
  signIn,
  refreshTokens,
};
