import cookie from "cookie-parser";
import jwt from "jsonwebtoken";
import Cart from "../../models/cart-model/index.js";
import dotenv from "dotenv";
import User from "../../models/auth-model/index.js";
import Products from "../../models/products-model/index.js";

dotenv.config();

export const addToCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req?.auth?.userId;
  const clerkID = req?.auth?.clerkID
  if (!productId)
    return res.json({ success: false, message: "ProductId Not Found" });

  if (!userId) return res.json({ success: false, message: "UserId Not Found" });

  const user = await User.findOne({ clerkID: userId });
  try {
    const alreadyHaveCart = await Cart.findOne({userId});
    console.log(alreadyHaveCart)
    if (!alreadyHaveCart) {
      const createCart = new Cart({
        clerkID,
        userId,
        items: [{ products: productId }],
      });
      await createCart?.save();
      return res.json({
        success: true,
        message: "Cart created & item added",
        createCart,
      });
    } else {
      const alreadyHaveThisProduct = alreadyHaveCart?.items?.find(
        (e) => e.products.toString() == productId?.toString(),
      );
      if (alreadyHaveThisProduct) {
        return res.json({
          success: true,
          message: "Item already added in you cart",
        });
      } else {
        alreadyHaveCart?.items?.push({ products: productId });
        await alreadyHaveCart?.save();
        res.json({
          success: true,
          message: "Product added to your cart",
          cart: alreadyHaveCart,
        });
      }
      await alreadyHaveCart.save();
      return res.json({
        success: true,
        message: "Item added",
        alreadyHaveCart,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const cartProducts = async (req, res) => {
  const userId = req?.auth?.userId;
  if (!userId) return res.json({ success: false, message: "UserId not found" });
  try {
    const cartProducts = await Cart.find({ userId }).populate("items.products");
    let items = cartProducts.items;
    console.log(Products);
    res.json({
      success: true,
      cartProducts,
      message: "Your cart items",
      items,
    });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req?.auth?.userId;

  if (!productId || !userId || quantity <= 0)
    return res.json({
      success: false,
      message: "Invalid credentials",
      productId,
    });

  try {
    const cart = await Cart.findOne({ userId });

    const gotem = cart?.items.find(
      (e) => e.products.toString() === productId.toString(),
    );

    gotem.quantity = quantity;
    await gotem.save();
    await cart.save();

    res.json({ success: true, message: "updated", gotem });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const removeItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req?.auth?.userId;

  if (!productId || !userId)
    return res.json({
      success: false,
      message: "ProductId and UserId not found",
    });

  try {
    const deleted = await Cart.updateOne(
      { userId },
      { $pull: { items: { products: productId } } },
    );

    if (deleted.modifiedCount === 0) {
      return res.json({
        success: false,
        message: "Item not found or already deleted",
        productId,
      });
    }

    res.json({ success: true, message: "Item removed", deleted });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
  }
};
