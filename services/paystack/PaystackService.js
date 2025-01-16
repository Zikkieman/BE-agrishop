const axios = require("axios");
const crypto = require("crypto");
const { events } = require("../../model/ProductModel");
const paystackApiKey = process.env.PAYSTACK_SECRET_KEY;
const paystackBaseUrl = process.env.PAYSTACK_BASEURL;
const paystackLiveSecretKey = process.env.PAYSTACK_LIVE_KEY;

const initPayment = async (req, res) => {
  const { email, amount } = req.body;
  console.log(email, amount, "payload");
  try {
    const response = await axios.post(
      `${paystackBaseUrl}/transaction/initialize`,
      { email, amount },
      {
        headers: {
          Authorization: `Bearer ${paystackApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      status: true,
      message: "Authorization URL created",
      authorization_url: response.data.data.authorization_url,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error initializing transaction",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(404).json({ message: "Missing transaction reference" });
  }

  try {
    const response = await axios.get(
      `${paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackApiKey}`,
        },
      }
    );

    if (response.data.data.status === "success") {
      return res.status(200).json({
        status: true,
        message: "Transaction verified successfully",
        data: response.data.data,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Transaction not successful",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error verifying transaction",
      error: error.message,
    });
  }
};

const paystackWebhook = (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const paystackSignature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === paystackSignature) {
    const event = req.body;
    console.log(event);
    if (event.event === "charge.success") {
      console.log(event.event);
      // Payment successful, update order
    }

    res.status(200).send();
  } else {
    res.status(400).send("Invalid signature");
  }
};

module.exports = { initPayment, verifyPayment, paystackWebhook };
