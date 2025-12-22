import Address from "../../models/address-model/index.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export const addAddress = async (req, res) => {
  const { userId, address, city, pinCode, phone } = req.body;
  console.log(userId, address, city, pinCode, phone);
  if (!userId && !address && !city && !pinCode && !phone)
    return res.json({ success: false, message: "All fields must be filled" });

  try {
    const newAddress = new Address({
      userId,
      address,
      city,
      pinCode,
      phone,
    });

    await newAddress.save();
    if (!newAddress)
      return res.json({ success: false, message: "Adress not added" });

    res.json({ success: true, message: "Address added", newAddress });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const fetchAddress = async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.SECRET);
  try {
    const address = await Address.find({ userId: decoded.id });
    if (!address)
      return res.json({ success: false, message: "No address found" });

    res.json({ success: true, message: "address added", address });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const editAddress = async (req, res) => {
  const { addressId, address, city, pinCode, phone } = req.body;
  console.log(addressId)
  try {
    const findAddress = await Address.findOne({ _id: addressId });

    if (!findAddress)
      return res.json({ success: false, message: "Adress not found" });

    findAddress.address = address || findAddress?.address;
    findAddress.city = city || findAddress?.city;
    findAddress.pinCode = pinCode || findAddress?.pinCode;
    findAddress.phone = phone || findAddress?.phone;

    await findAddress.save();


    res.json({ success: true, message: "Address update" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const deleteAddress = async (req, res) => {
  const { addressId } = req.body;
  if (!addressId)
    return res.json({ success: false, message: "Address ID not found" });

  const deleted = await Address.findByIdAndDelete({ _id: addressId });
  if (!deleted) return res.json({ success: false, message: "Not deleted" });
  res.json({ success: true, message: "Deleted", deleted });
  try {
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};
