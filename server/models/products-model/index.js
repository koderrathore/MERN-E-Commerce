import mongoose, { Types } from "mongoose";

const ProductsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default:0,
    },
    totalStock: {
      type: Number,
      default:1,
    },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", ProductsSchema);
export default Products;
