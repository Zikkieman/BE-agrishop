const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authCheck = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ message: "Authenticated", user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { authCheck, logout };
