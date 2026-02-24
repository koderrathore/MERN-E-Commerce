import User from "../../models/auth-model/index.js";
import Reviews from "../../models/reviews-model/index.js";

export const authMiddleWare = async (req, res,next) => {
  const { userId } = req.auth();
  if (!userId)
    return res.json({ success: false, message: "UnAuthorized User" });
  
  const user = await User.findOne({ clerkID: userId });
  if (!user) return res.json({ success: false, message: "User Not Found" });
  
  req.auth.clerkID = userId
  req.auth.userId = user._id
  next();
};

export const roleMiddleware = async (req, res,next) => {
  const {sessionClaims} = req.auth()
  const role = sessionClaims?.meta?.role;

  if (!role == "admin")
    return res.json({ success: false, message: "Not authorized to access this route" });

  next();
};
