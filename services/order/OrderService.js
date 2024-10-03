const { default: axios } = require("axios");
const Order = require("../../model/OrderModel");
const paystackApiKey = process.env.PAYSTACK_SECRET_KEY;
const paystackBaseUrl = process.env.PAYSTACK_BASEURL;
const crypto = require("crypto");
const { sendEmail } = require("../../middleware/SendMail");
const Cart = require("../../model/CartModel");

const createOrder = async (req, res) => {
  try {
    const order = new Order({
      user: req.user.id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      billingInfo: req.body.billingInfo,
      additionalInfo: req.body.additionalInfo,
      paymentStatus: "pending",
      status: "pending",
    });

    const savedOrder = await order.save();

    const response = await axios.post(
      `${paystackBaseUrl}/transaction/initialize`,
      {
        email: req.user.email,
        amount: req.body.totalAmount * 100,
        metadata: {
          id: savedOrder._id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${paystackApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    savedOrder.reference = response.data.data.reference;
    await savedOrder.save();

    const result = await Cart.deleteOne({ userId: req.user.id });

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
          <p>User: ${req.user.email}</p>
          <p>Order ID: ${savedOrder._id}</p>
          <p>Total Amount: ₦${savedOrder.totalAmount}</p>
          <p>Payment Status: ${savedOrder.paymentStatus}</p>
        `;

    await sendEmail({
      to: "horlarmeydeileh50@gmail.com",
      subject: "New Order Created",
      html: adminEmailHtml,
    });

    res.cookie("transaction_reference", savedOrder.reference, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
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
  const secret = paystackApiKey;
  const paystackSignature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== paystackSignature) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

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
        to: "horlarmeydeileh50@gmail.com",
        subject: "Order Payment Confirmed",
        html: adminPaymentEmailHtml,
      });
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Server Error");
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
    const orders = await Order.find().sort({ createdAt: -1 }).exec();

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
};
