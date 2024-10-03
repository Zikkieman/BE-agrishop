const newUser = require("../../model/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../middleware/SendMail");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET;

const registerUser = async (body, res) => {
  const {
    phoneNumber,
    password,
    email,
    firstName,
    lastName,
    confirmPassword,
    termsAccepted,
  } = body;

  try {
    const existingUser = await newUser.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (!existingUser.isVerified) {
        const token = jwt.sign({ email: existingUser.email }, JWT_SECRET, {
          expiresIn: "15m",
        });
        await sendVerificationEmail(existingUser.email, token);

        return res.status(403).json({
          message:
            "An account with this email or phone number already exists but is not verified. A new verification email has been sent.",
        });
      }

      return res.status(409).json({
        message: "User with this email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new newUser({
      phoneNumber,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      termsAccepted,
      isVerified: false,
    });

    const savedUser = await user.save();

    const token = jwt.sign({ email: savedUser.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendVerificationEmail(savedUser.email, token);

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error registering user:", JSON.stringify(error));
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

const loginUser = async (body, res) => {
  const { email, password } = body;
  try {
    const user = await newUser.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      await sendVerificationEmail(user.email, token);

      return res.status(403).json({
        message: "Email not verified. A new verification email has been sent.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "Strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await newUser.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = { registerUser, verifyEmail, loginUser };
