import Reviews from "../../models/reviews-model/index.js";
import mongoose from "mongoose";

export const addReviews = async (req, res) => {
  const { user, productId, review, ratings } = req.body;
  if (!user && !productId && !review && !ratings)
    return res.json({
      success: false,
      message: "didn't get all fileds",
      user,
      productId,
      review,
      ratings,
    });

  try {
    const alreadygaveReview = await Reviews.findOne({
      userId: user.userId,
      productId: new mongoose.Types.ObjectId(productId),
    });

    if (alreadygaveReview)
      return res.json({
        success: true,
        message: "You already gave review MF",
      });

    const createdReview = new Reviews({
      userId: user.userId,
      productId,
      review,
      ratings,
    });

    await createdReview.save();

    if (!createdReview)
      return res.json({
        success: true,
        message: "Cann't Add Review",
        createdReview,
      });

    res.json({
      success: true,
      message: "Review Added",
      createdReview,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const productReview = async (req, res) => {
  const { userId,productId } = req.body;
  console.log(productId);
  if (!productId)
    return res.json({
      success: false,
      message: "didn't get all fileds",
    });

  try {
    const review = await Reviews.find({
      productId: new mongoose.Types.ObjectId(productId),
    })
      .populate("userId")
      .populate("productId");

    if (!review)
      return res.json({
        success: false,
        message: "didn't find it",
      });

    res.json({ success: true, message: "Reviews of this product", review });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};
