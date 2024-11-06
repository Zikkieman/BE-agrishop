require("dotenv").config();
const nodemailer = require("nodemailer");

const appPassword = process.env.APP_PASSWORD;
const sender = process.env.EMAIL_SENDER;

const sendVerificationEmail = async (email, verificationUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: sender,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: '"Agrishop" horlameydeileh50@gmail.com',
    to: email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking the link below:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: sender,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: `"Agrishop" <${sender}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendEmail };
