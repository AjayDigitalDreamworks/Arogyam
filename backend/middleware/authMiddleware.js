const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// In-memory token blacklist (simple approach for logout/revocation)
const blacklistedTokens = new Set();

const blacklistToken = (token) => {
  if (token) blacklistedTokens.add(token);
};

const verifyToken = (req, res, next) => {
  // Support both Authorization header and cookie-based token
  let token = null;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Token has been revoked" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("invalid token",err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;  // Attach decoded user data to the request
    next();
  });
};

module.exports = { verifyToken, blacklistToken }; 
