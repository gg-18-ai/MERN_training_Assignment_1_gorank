const express = require("express");

const reviewController = require("../controller/reviewController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const {
  createReviewSchema,
  getReviewsSchema,
  reviewIdSchema,
  updateReviewSchema,
} = require("../validationSchema/reviewValidationSchema");

const reviewRouter = express.Router();

reviewRouter.post(
  "/createReview",
  validationMiddleware(createReviewSchema),
  reviewController.createReview
);

reviewRouter.get(
  "/getReviews",
  validationMiddleware(getReviewsSchema, "query"),
  reviewController.getReviews
);

reviewRouter.get(
  "/getSingleReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  reviewController.getSingleReview
);

reviewRouter.patch(
  "/updateReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  validationMiddleware(updateReviewSchema),
  reviewController.updateReview
);

module.exports = reviewRouter;
