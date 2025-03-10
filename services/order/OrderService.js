const { default: axios } = require("axios");
const Order = require("../../model/OrderModel");
const paystackApiKey = process.env.PAYSTACK_SECRET_KEY;
const paystackBaseUrl = process.env.PAYSTACK_BASEURL;
const paystackLiveSecretKey = process.env.PAYSTACK_LIVE_KEY;

const crypto = require("crypto");
const { sendEmail } = require("../../middleware/SendMail");
const Cart = require("../../model/CartModel");
const adminEmail = process.env.EMAIL_SENDER;

const createOrder = async (req, res) => {
  try {
    const response = await axios.post(
      `${paystackBaseUrl}/transaction/initialize`,
      {
        email: req.user.email,
        amount: req.body.totalAmount * 100,
        metadata: {
          userId: req.user.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${paystackLiveSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.status) {
      return res.status(400).json({ message: "Failed to initialize payment" });
    }

    const order = new Order({
      user: req.user.id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      billingInfo: req.body.billingInfo,
      additionalInfo: req.body.additionalInfo,
      paymentStatus: "pending",
      status: "pending",
      reference: response.data.data.reference,
    });

    const savedOrder = await order.save();

    await Cart.deleteOne({ userId: req.user.id });

    const userEmailHtml = `
      <p>Your order has been created successfully!</p>
      <p>Order ID: ${savedOrder._id}</p>
      <p>Total Amount: ₦${savedOrder.totalAmount}</p>
      <p>Thank you for your order! Please complete your payment on the website.</p>
    `;

    await sendEmail({
      to: req.user.email,
      subject: "Your Order has been created",
      html: userEmailHtml,
    });

    const adminEmailHtml = `
      <p>New order created</p>
      <p>User Email: ${req.user.email}</p>
      <p>User Name: ${savedOrder.billingInfo.firstName} ${savedOrder.billingInfo.lastName}</p>
      <p>Address: ${savedOrder.billingInfo.address}, ${savedOrder.billingInfo.state}, ${savedOrder.billingInfo.country}</p>
      <p>Additional Information: ${savedOrder.additionalInfo}</p>
      <p>Order ID: ${savedOrder._id}</p>
      <p>Total Amount: ₦${savedOrder.totalAmount}</p>
      <p>Payment Status: ${savedOrder.paymentStatus}</p>
    `;

    await sendEmail({
      to: `${adminEmail}`,
      subject: "New Order Created",
      html: adminEmailHtml,
    });

    return res.status(200).json({
      status: true,
      message: "Order created and payment initialized",
      authorization_url: response.data.data.authorization_url,
      order: savedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order", error });
  }
};

const paystackWebhook = async (req, res) => {
  const secret = paystackLiveSecretKey;
  const paystackSignature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== paystackSignature) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  console.log(event);

  try {
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      const order = await Order.findOne({ reference }).populate(
        "user",
        "email"
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.paymentStatus === "completed") {
        return res.status(200).send("Order already completed");
      }

      order.paymentStatus = "completed";
      order.status = "processing";
      await order.save();

      const userPaymentEmailHtml = `
            <p>Your payment for Order ID: ${order._id} was successful!</p>
            <p>Order Status: Processing</p>
            <p>Thank you for shopping with us.</p>
          `;

      await sendEmail({
        to: order.user.email,
        subject: "Payment Successful",
        html: userPaymentEmailHtml,
      });

      const adminPaymentEmailHtml = `
            <p>Payment for Order ID: ${order._id} has been confirmed.</p>
            <p>Order Status: Processing</p>
            <p>User: ${order.user.email}</p>
          `;

      await sendEmail({
        to: `${adminEmail}`,
        subject: "Order Payment Confirmed",
        html: adminPaymentEmailHtml,
      });
    }

    res.status(200).send();
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const updatePayment = async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === paymentStatus) {
      return res
        .status(200)
        .json({ message: "Payment status is already up-to-date." });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "completed") {
      order.status = "processing";
    }

    if (paymentStatus === "pending") {
      order.status = "pending";
    }

    await order.save();

    res
      .status(200)
      .json({ message: `Payment status updated to ${paymentStatus}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const savedOrder = await Order.findById(orderId);

    if (!savedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (savedOrder.status === status) {
      return res
        .status(200)
        .json({ message: "Order status is already up-to-date." });
    }

    savedOrder.status = status;
    await savedOrder.save();

    return res
      .status(200)
      .json({ message: `Order status updated to ${status}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkOrderStatus = async (req, res) => {
  try {
    const reference = req.cookies.transaction_reference;

    if (!reference) {
      return res
        .status(400)
        .json({ message: "Transaction reference not found" });
    }

    const order = await Order.findOne({ reference });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ paymentStatus: order.paymentStatus });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name imageUrl price description stock")
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Orders not found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "email phoneNumber")
      .populate("items.productId", "name imageUrl price description stock")
      .sort({ createdAt: -1 })
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "Orders not found" });
    }
    return res.status(200).json({ message: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  paystackWebhook,
  checkOrderStatus,
  getAllOrders,
  getUserOrders,
  updatePayment,
  updateStatus,
};
