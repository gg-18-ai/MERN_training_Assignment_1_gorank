const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const staffRouter = require("./src/routes/staff.route");
const { notFound, errorHandler } = require("./src/middlewares/errorHandler");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/staff", staffRouter);

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
