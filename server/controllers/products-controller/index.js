import { imageUpload } from "../../config/cloudinary.js";
import Products from "../../models/products-model/index.js";

export const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUpload(url);

    res.json({ success: true, message: "Image uploaded successfully", result });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

//Add Product
export const addProducts = async (req, res) => {
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;
  if (
    !image &&
    !title &&
    !description &&
    !category &&
    !brand &&
    !price &&
    !totalStock
  )
    return res.json({
      success: false,
      message: "Every filed must be filled, except sales price",
    });

  try {
    const newProduct = new Products({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newProduct.save();

    if (!newProduct)
      return res.json({ success: false, message: "Cann't add products now" });

    res.json({ success: true, message: "Product addded", newProduct });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

//Fetch Product
export const fethProducts = async (req, res) => {
  console.log("object")
  try {
    const allProducts = await Products.find();
    if (!allProducts)
      return res.json({ success: false, message: "No products Here" });

    return res.json({ success: true, message: "All Products", allProducts });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

//Update Product
export const updateProducts = async (req, res) => {
  const { id } = req.params;
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;
  if (
    !image &&
    !title &&
    !description &&
    !category &&
    !brand &&
    !price &&
    !totalStock
  )
    return res.json({
      success: false,
      message: "Every filed must be filled, except sales price",
    });
  try {
    const findProduct = await Products.findById(id);
    if (!findProduct)
      return res.json({ success: false, message: "Product not found" });

    findProduct.image = image || findProduct.image;
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price || findProduct.price;
    findProduct.salePrice = salePrice || findProduct.salePrice || 0;
    findProduct.totalStock = totalStock || findProduct.totalStock || 1;

    await findProduct.save();

    res.json({ success: true, message: "Product updated", findProduct });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

//Delete Product
export const deleteProducts = async (req, res) => {
  const { id } = req.params;
  const deleted = await Products.findByIdAndDelete(id);
  if (!deleted)
    return res.json({ success: false, message: "Product not found" });

  res.json({ success: true, message: "Product deleted", deleted });
  try {
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

