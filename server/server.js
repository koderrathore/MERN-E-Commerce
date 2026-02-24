import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-route/index.js";
import adminRouter from "./routes/admin-routes/index.js";
import shoppingRouter from "./routes/shop-routes/index.js";
import cartROuter from "./routes/cart-routes/index.js";
import addressRouter from "./routes/address-routes/index.js";
import ordersRouter from "./routes/orders-routes/index.js";
import reviewsRouter from "./routes/reviews-routes/index.js";
import { clerkMiddleware } from "@clerk/express";
import webHooksRouter from "./routes/webhooks-route/index.js";
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

//Mongo
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected"))
  .catch((e) => console.log(e));

//Cors
app.use("/webhooks", express.raw({ type: "application/json" }), webHooksRouter);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  }),
);

//Razorpay
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/shop", shoppingRouter);
app.use("/api/cart", cartROuter);
app.use("/api/address", addressRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
