import Address from "../../models/address-model/index.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export const addAddress = async (req, res) => {
  const { address, city, pinCode, phone } = req.body;
  const userId = req?.auth?.userId
  const clerkID = req?.auth?.clerkID
  if (!userId || !address || !city || !pinCode || !phone)
    return res.json({ success: false, message: "All fields must be filled" });

  const limitAdress = await Address.find({userId})
  if(limitAdress.legth>3) return res.json({success:false,message:"You cann't add more than 3 Adresses"})

  try {

    const newAddress = new Address({
      clerkID,
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
const userId = req?.auth?.userId
  try {
    const address = await Address.find({ userId });
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
  try {
    const findAddress = await Address.findOne({_id: addressId });

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
console.log(typeof(addressId))
  const deleted = await Address.findByIdAndDelete(addressId);
  if (!deleted) return res.json({ success: false, message: "Not deleted" });
  res.json({ success: true, message: "Deleted", deleted });
  try {
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};
