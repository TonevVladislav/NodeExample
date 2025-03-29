const User = require("../db/models/User");
const AppError = require("../utils/error.handler.util");

async function getUserByEmail(email) {
  const user = await User.findOne({ email: email });
  if (!user) throw new AppError("User doesnt exist!");
  return user;
}

async function getUserById(id) {
  const user = await User.findById(id).select("-hashedPassword");
  if (!user) throw new AppError("User doesnt exist!");
  return user;
}

async function updateUserInfo(username, email) {
  const user = await getUserByEmail(email);
  user.username = username;
  await user.save();
  if (!user) throw new AppError("User doesnt exist!");
  return user;
}

async function updatePassword(currentPassword, newPassword, userId) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Incorrect email or password");
  }
  const hashMatch = await compare(currentPassword, user.hashedPassword);
  if (!hashMatch) {
    throw new AppError("Incorrect email or password");
  } else {
    const hashedPassword = await hash(newPassword, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    return user;
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserInfo,
  updatePassword,
};
