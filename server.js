const express = require("express");

const connectDB = require("./src/config/db");
const reviewRouter = require("./src/routes/review.route");
const { notFound, errorHandler } = require("./src/middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use("/reviews", reviewRouter);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server starts on port 3000");
    });
  })
  .catch((error) => {
    console.log("database connection error", error);
  });
