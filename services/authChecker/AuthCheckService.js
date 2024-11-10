const jwt = require("jsonwebtoken");
const newUser = require("../../model/UserModel");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET;

const authCheck = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const userEmail = decoded.email;

      const user = await newUser.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userNames = {
        firstName: user.firstName,
        lastName: user.lastName,
      };
      return res
        .status(200)
        .json({ message: "Authenticated via refresh token", userNames });
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: "Token expired or invalid" });
    }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    const user = await newUser.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userNames = {
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.status(200).json({ message: "Authenticated", userNames });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Token expired or invalid" });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Access denied. No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { authCheck, logout, refreshAccessToken };
