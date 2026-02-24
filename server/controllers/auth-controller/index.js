import mongoose from "mongoose";
import Users from "../../models/auth-model/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username.trim() && !email.trim() && !password.trim())
    return res.json({ success: false, message: "Every field must be filled" });

  //Password
  if (password.length < 3)
    return res.json({
      success: false,
      message: "Password must be atleast 4 characters long",
    });

  if (password.length > 15)
    return res.json({
      success: false,
      message: "Password must be under 15 characters",
    });

  const hashPassword = await bcrypt.hash(password, 12);

  //UserCheck
  const alreadyUser = await Users.findOne({ username });
  const alreadEmail = await Users.findOne({ email });

  if (alreadyUser || alreadEmail)
    return res.json({ success: false, message: "User already exist" });

  try {
    const newUser = new Users({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    if (newUser)
      return res.json({
        success: true,
        message: "Register successfull",
        newUser,
      });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() && !password.trim())
    return res.json({ success: false, message: "All field must be filled" });

  if (password.length < 3)
    return res.json({
      success: false,
      message: "Password must have atleast 4 characters",
    });

  const isUser = await Users.findOne({ email });

  if (!isUser)
    return res.json({
      success: false,
      message: "You don,t have an account yet, register first",
    });

  const hashPassword = await bcrypt.compare(password, isUser.password);

  try {
    if (!hashPassword)
      return res.json({ success: false, message: "Password is incorrect" });

    //set Token-
    const token = jwt.sign(
      {
        username: isUser.username,
        email: isUser.email,
        id:isUser._id,
        password: isUser.password,
        role: isUser.role,
      },
      process.env.SECRET
    );

    // res
    //   .cookie("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //   })
    //   .json({ success: true, message: "Login successfull", isUser });

    res.json({success:true,message:"Login Successfull",token,isUser})
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const logOutUser = async (req, res) => {
  try {
    res
      .clearCookie("token")
      .json({ success: true, message: "LogOut successfull" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// export const checkLogin = async (req, res) => {
//   const token = req.cookies.token;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.SECRET);
//       if (!decoded)
//         return res.json({ success: false, message: "UnAuthenticated user" });

//       return res.json({ success: true, message: "Already Login", decoded });
//     } catch (err) {
//       console.log(err);
//       return res.json({ success: false, message: "Something went wrong" });
//     }
//   }else{
//     return res.json({success:false,message:"Not logged in"})
//   }
// };

export const checkLogin = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      if (!decoded)
        return res.json({ success: false, message: "UnAuthenticated user" });

      return res.json({ success: true, message: "Already Login", decoded });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "Something went wrong" });
    }
  }else{
    return res.json({success:false,message:"Not logged in"})
  }
};
