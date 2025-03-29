const JWT_EXPIRATION = "1h";
// buddy ignore:start
const RATE_LIMITER_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hrs in milliseconds
// buddy ignore:end
const RATE_LIMITER_LIMIT = 100;

module.exports = { JWT_EXPIRATION, RATE_LIMITER_WINDOW_MS, RATE_LIMITER_LIMIT };
