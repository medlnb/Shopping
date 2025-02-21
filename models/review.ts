import mongoose, { Schema, models, model } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = models.Review || model("Review", reviewSchema);
export default Review;
