const joi = require("joi");

const objectId = joi
  .string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ "string.pattern.base": "id must be a valid MongoDB ObjectId" });

const reviewFields = {
  title: joi.string().trim().min(3).max(80),
  comment: joi.string().trim().min(10).max(500),
  rating: joi.number().integer().min(1).max(5),
  reviewerName: joi.string().trim().min(2).max(50),
};

// ye POST /reviews/createReview API ke liye hai
const createReviewSchema = joi.object({
  title: reviewFields.title.required(),
  comment: reviewFields.comment.required(),
  rating: reviewFields.rating.required(),
  reviewerName: reviewFields.reviewerName.required(),
});

// ye GET /reviews/getReviews API ke liye hai
const getReviewsSchema = joi.object({
  status: joi.string().valid("pending", "approved", "rejected"),
  minRating: joi.number().min(1).max(5),
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(20).default(10),
});

// ye routes jahan :id aata hai un APIs ke liye hai
const reviewIdSchema = joi.object({
  id: objectId.required(),
});

// ye PATCH /reviews/updateReview/:id API ke liye hai
const updateReviewSchema = joi
  .object({
    title: reviewFields.title,
    comment: reviewFields.comment,
    rating: reviewFields.rating,
    reviewerName: reviewFields.reviewerName,
  })
  .min(1)
  .messages({ "object.min": "At least one field is required to update" });

module.exports = {
  createReviewSchema,
  getReviewsSchema,
  reviewIdSchema,
  updateReviewSchema,
};
