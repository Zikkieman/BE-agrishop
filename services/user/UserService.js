const newUser = require("../../model/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendEmail,
} = require("../../middleware/SendMail");
const Contact = require("../../model/ContactModel");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;
const adminEmail = process.env.EMAIL_SENDER;

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
        const verificationUrl = `${BASE_URL}/verify-email?token=${token}&type=verification`;
        await sendVerificationEmail(existingUser.email, verificationUrl);

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
      role: "user",
    });

    const savedUser = await user.save();

    const token = jwt.sign({ email: savedUser.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const verificationUrl = `${BASE_URL}/verify-email?token=${token}&type=verification`;

    await sendVerificationEmail(savedUser.email, verificationUrl);

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
      { expiresIn: "3d" } // Set the token to expire in 3 days
    );

    // Return the token and user info in the response
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userEmail = decoded.email;

    const user = await newUser.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (request, res) => {
  const { token, type } = request.query;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await newUser.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (type === "recovery") {
      return res
        .status(200)
        .json({ message: "Token verified. Redirect to /new-password" });
    } else {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: "Email verified successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

const newPassword = async (req, res) => {
  const { email, password, confirmPassword } = req;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await newUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const recoveryEmail = async (req, res) => {
  const { email } = req;
  try {
    const user = await newUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}&type=recovery`;
    await sendVerificationEmail(user.email, verificationLink);

    return res.status(200).json({ message: "Recovery email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendContact = async (req, res) => {
  const { fullName, email, message, phoneNumber } = req.body;

  try {
    const adminHtml = `
      <p><strong>New Contact Message</strong></p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone number:</strong> ${phoneNumber}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    await sendEmail({
      to: `${adminEmail}`,
      subject: "New Contact Message from Agrishop",
      html: adminHtml,
    });

    const newContact = new Contact({ fullName, email, message, phoneNumber });
    await newContact.save();

    res.status(200).json({ message: "Message sent and saved successfully!" });
  } catch (error) {
    console.error("Error processing contact message:", error);
    res.status(500).json({
      error: "Error saving contact and sending email",
      details: error,
    });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  sendContact,
  recoveryEmail,
  newPassword,
  getUserDetails,
};
