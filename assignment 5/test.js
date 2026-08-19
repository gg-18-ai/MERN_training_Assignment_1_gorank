const connectDB = require("./src/config/db");
const ReviewModel = require("./src/model/reviewModel");

const run = async () => {
  try {
    await connectDB();

    const review = await ReviewModel.create({
      title: "Nice product",
      comment: "Delivery was fast and quality is very good",
      rating: 5,
      reviewerName: "Rahul",
    });

    console.log("created review id:", review._id.toString());
  } catch (error) {
    console.log(error.message);
  } finally {
    process.exit();
  }
};

run();
