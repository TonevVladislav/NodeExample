const jwt = require("jsonwebtoken");

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived token (e.g., 15 mins)
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" } // Long-lived token (e.g., 7 days)
  );

  return { accessToken, refreshToken };
}

module.exports = {
  generateTokens,
};
