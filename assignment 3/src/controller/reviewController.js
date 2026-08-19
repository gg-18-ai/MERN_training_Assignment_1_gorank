const reviewService = require("../service/reviewService");
const httpStatus = require("../utils/httpStatus");

const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).json({ success: true, message: "Review created successfully", data: review });
};

const getReviews = async (req, res) => {
  const data = await reviewService.getReviews(req.query);
  res.status(httpStatus.OK).json({ success: true, message: "Reviews fetched successfully", data });
};

const getSingleReview = async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  res.status(httpStatus.OK).json({ success: true, message: "Review fetched successfully", data: review });
};

const updateReview = async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.body);
  res.status(httpStatus.OK).json({ success: true, message: "Review updated successfully", data: review });
};

module.exports = {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
};
