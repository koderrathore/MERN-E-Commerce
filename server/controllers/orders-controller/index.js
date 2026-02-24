import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import Orders from "../../models/orders-model/index.js";
import Products from "../../models/products-model/index.js";
import { instance } from "../../server.js";
import crypto from "crypto";

export const getKey = async (req, res) => {
  res.json({ key: process.env.RAZORPAY_API_KEY });
};

export const createOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount)
    return res.json({ success: false, message: "Something went wrong" });

  const option = {
    amount: Number(amount * 100),
    currency: "INR",
  };

  try {
    const order = await instance.orders.create(option);
    if (!order)
      return res.json({ success: false, message: "Something went wrong" });

    res.json({
      success: true,
      message: "order creatd",
      order,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const paymentVerification = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    userDet,
  } = req.body;
  if (!razorpay_payment_id && !razorpay_order_id && !razorpay_signature)
    return res.json({ success: false, message: "Something went wrong" });
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");
  if (razorpay_signature === expectedSignature) {
    try {
      const newOrder = new Orders({
        clerkID: req.auth.clerkID,
        userId: req.auth.userId,
        items: userDet.item?.map((e) => ({
          productId: e.products._id,
          image: e.products?.image,
          quantity: e.quantity,
        })),
        amount: userDet.totalAmount,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        addressInfo: {
          address: userDet.selectedAddress.address,
          city: userDet.selectedAddress.city,
          pinCode: userDet.selectedAddress.pinCode,
          phone: userDet.selectedAddress.phone,
        },
      });

      await newOrder.save();

      if (newOrder) {
        for (const e of newOrder.items) {
          const product = await Products.findById(e.productId);
          if (!product) continue;

          product.totalStock = product.totalStock - e.quantity;
          await product.save();
        }

        res.json({
          success: true,
          message: "Order created",
          newOrder,
        });
      } else {
        res.json({ success: false, message: "Order not Created" });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: "Something went wrong" });
    }
  }
};

export const allOrders = async (req, res) => {
  const userId = req?.auth?.userId;
  if (!userId)
    return res.json({ success: false, message: "Please provide userId" });
  try {
    const allOrders = await Orders.find({ userId })
      .populate("items.productId")
      .populate("addressInfo");
    if (!allOrders)
      return res.json({ success: false, message: "Cann,t find orders" });
    res.json({ success: true, message: "All orders", allOrders });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const allOrdersForAdmin = async (req, res) => {
  try {
    const allOrders = await Orders.find()
      .populate("items.productId")
      .populate("addressInfo");
    if (!allOrders)
      return res.json({ success: false, message: "Cann,t find orders" });
    res.json({ success: true, message: "All orders", allOrders });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus, id } = req.body;
  if (!orderStatus && id)
    return res.json({
      success: false,
      message: "Please give order status and id",
    });

  try {
    const updatedOrderStatus = await Orders.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    await updatedOrderStatus.save();

    if (!updatedOrderStatus)
      return res.json({ success: false, message: "Not update" });

    res.json({ success: true, message: "Status Updated", updatedOrderStatus });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};
