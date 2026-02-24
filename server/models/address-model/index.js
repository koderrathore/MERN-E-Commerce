import mongoose from "mongoose";

const addressScherma = new mongoose.Schema({
  clerkID: {
    type: String,
    required: true,
  },
  userId: String,
  address: String,
  city: String,
  pinCode: Number,
  phone: Number,
});

const Address = mongoose.model("Address", addressScherma);
export default Address;
