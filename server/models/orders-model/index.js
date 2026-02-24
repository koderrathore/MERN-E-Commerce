import mongoose, { now } from "mongoose";

const OrdersSchema = mongoose.Schema(
  {
    clerkID: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
        },
        image: String,
        quantity: Number,
      },
    ],
    amount: Number,
    orderId: String,
    paymentId: String,
    orderStatus: {
      type: String,
      default: "pending",
    },
    addressInfo: {
      address: String,
      city: String,
      pinCode: Number,
      phone: Number,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timeStamps: true },
);

const Orders = mongoose.model("Orders", OrdersSchema);
export default Orders;
