import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  clerkID:{
    type:String,
    required:true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required:true,
    ref: "Users",
  },
  items: [
    {
      products: {
        type: mongoose.Types.ObjectId,
        required:true,
        ref: "Products",
      },
      quantity: {
        type: Number,
        default:1,
      },
    },
  ],
});

const Cart = mongoose.model("Carts",cartSchema)
export default Cart