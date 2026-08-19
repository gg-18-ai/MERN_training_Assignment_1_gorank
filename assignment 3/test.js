const connectDB = require("./src/config/db");
const ReviewModel = require("./src/model/reviewModel");

const run = async () => {
  try {
    await connectDB();

    const review = await ReviewModel.create({
      title: "Bahut accha product",
      comment: "Delivery fast thi aur quality bhi acchi hai",
      rating: 5,
      reviewerName: "Rahul",
    });
    console.log("valid data saved:", review._id.toString());
  } catch (error) {
    console.log("valid data error:", error.message);
  }

  try {
    await ReviewModel.create({
      title: "Nice product",
      comment: "Yeh comment minimum length se bada hai",
      rating: 6,
      reviewerName: "Rahul",
    });
  } catch (error) {
    console.log("rating 6 error:", error.message);
  }

  try {
    await ReviewModel.create({
      title: "Nice product",
      comment: "Yeh comment minimum length se bada hai",
      rating: 3.5,
      reviewerName: "Rahul",
    });
  } catch (error) {
    console.log("rating 3.5 error:", error.message);
  }

  try {
    await ReviewModel.create({
      title: "Nice product",
      comment: "Yeh comment minimum length se bada hai",
      rating: 4,
      reviewerName: "Rahul",
      status: "blocked",
    });
  } catch (error) {
    console.log("invalid status error:", error.message);
  }

  process.exit();
};

run();
