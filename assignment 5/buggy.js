const express = require("express");

const ReviewModel = require("./src/model/reviewModel");
const reviewRouter = require("./src/routes/review.route");
const { notFound, errorHandler } = require("./src/middlewares/errorHandler");
const apiError = require("./src/utils/apiError");

const app = express();

app.use(express.json());
app.use("/reviews", reviewRouter);

const getReview = async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);

  if (!review) {
    throw apiError.notFound("Review");
  }

  res.json(review);
};

app.get("/buggy/getSingleReview/:id", getReview);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
