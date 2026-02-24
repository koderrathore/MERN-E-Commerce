import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
   clerkID:{
    type:String,
    required:true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Products",
  },
  review: String,
  ratings: {
    type: Number,
    default: 1,
  },
});

const Reviews = mongoose.model("Reviews", reviewsSchema);
export default Reviews;
