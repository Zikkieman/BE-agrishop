const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  let token = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // If accessToken exists, try to verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next(); // Proceed to the next middleware
    } catch (error) {
      // If token verification fails, log the error (optional)
      console.error("Access token verification failed:", error.message);
    }
  }

  // If no valid accessToken, try to use the refreshToken
  if (refreshToken) {
    try {
      // Verify the refresh token
      const decodedRefresh = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const userEmail = decodedRefresh.email;

      // (Re)Generate a new access token
      const newAccessToken = jwt.sign(
        { email: userEmail },
        JWT_SECRET,
        { expiresIn: "15m" } // Set a short lifespan for access token
      );

      // Set the new access token as a cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set `secure` flag in production
      });

      // Attach user info to the request and proceed
      req.user = jwt.verify(newAccessToken, JWT_SECRET);
      return next();
    } catch (error) {
      console.error("Refresh token verification failed:", error.message);
      return res
        .status(403)
        .json({ message: "Session expired. Please log in again." });
    }
  }

  // If no valid tokens are found
  return res
    .status(403)
    .json({ message: "Access denied. No valid token provided." });
};

module.exports = verifyToken;
