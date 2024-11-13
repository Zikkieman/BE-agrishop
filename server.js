const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserRoutes = require("./route/user/UserRoute.js");
const AuthRoutes = require("./route/authChecker/AuthRoute.js");
const ProductRoutes = require("./route/product/Product.js");
const CategoryRoutes = require("./route/category/Category.js");
const CartRoutes = require("./route/cart/Cart.js");
const InfoRoutes = require("./route/billingInfo/BillingInfo.js");
const PaymentRoutes = require("./route/paystack/Paystack.js");
const OrderRoutes = require("./route/order/Order.js");
const TagRoutes = require("./route/tag/Tag.js");

const connectDB = require("./config/database.js");
const { notFound, errorHandler } = require("./middleware/ErrorHandler.js");

const app = express();
const port = 5000;
app.options("*", cors());

const allowedOrigins = [
  "http://localhost:5173",
  "https://agrishop-five.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/cart", CartRoutes);
app.use("/api/v1/info", InfoRoutes);
// app.use("/api/v1/payment", PaymentRoutes);
app.use("/api/v1/order", OrderRoutes);
app.use("/api/v1/tag", TagRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server listen on port ${port}`);
});
