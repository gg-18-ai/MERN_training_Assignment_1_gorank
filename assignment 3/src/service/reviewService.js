const ReviewModel = require("../model/reviewModel");
const apiError = require("../utils/apiError");

const createReview = async (data) => {
  const alreadyReviewed = await ReviewModel.findOne({
    reviewerName: data.reviewerName,
    title: data.title,
  });

  if (alreadyReviewed) {
    throw apiError.conflict("You have already submitted this review");
  }

  return ReviewModel.create(data);
};

const getReviews = async (queryParams) => {
  const { status, minRating, page, limit } = queryParams;
  const filter = {};

  if (status) filter.status = status;

  if (minRating !== undefined) {
    filter.rating = {};
    filter.rating.$gte = minRating;
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    ReviewModel.find(filter).skip(skip).limit(limit),
    ReviewModel.countDocuments(filter),
  ]);

  return {
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const updateReview = async (id, data) => {
  const review = await ReviewModel.findById(id);

  if (!review) {
    throw apiError.notFound("Review");
  }

  Object.assign(review, data);
  await review.save();

  return review;
};

const getReviewById = async (id) => {
  const review = await ReviewModel.findById(id);

  if (!review) {
    throw apiError.notFound("Review");
  }

  return review;
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  getReviewById,
};
