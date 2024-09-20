const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserRoutes = require("./route/user/UserRoute.js");
const AuthRoutes = require("./route/authChecker/AuthRoute.js");

const connectDB = require("./config/database.js");
const { notFound, errorHandler } = require("./middleware/ErrorHandler.js");

const app = express();
const port = 5000;

const allowedOrigins = ["http://localhost:5173", "https://yourdomain.com"];

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

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server listen on port ${port}`);
});
