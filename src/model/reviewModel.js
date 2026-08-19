const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [3, "Title must be at least 3 characters long"],
      maxLength: [80, "Title cannot be more than 80 characters long"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      minLength: [10, "Comment must be at least 10 characters long"],
      maxLength: [500, "Comment cannot be more than 500 characters long"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
    },
    reviewerName: {
      type: String,
      required: [true, "Reviewer name is required"],
      minLength: [2, "Reviewer name must be at least 2 characters long"],
      maxLength: [50, "Reviewer name cannot be more than 50 characters long"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("review", reviewSchema);

module.exports = ReviewModel;
