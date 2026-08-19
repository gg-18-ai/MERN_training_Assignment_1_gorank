const connectDB = require("./src/config/db");
const StaffModel = require("./src/model/staffModel");

const run = async () => {
  try {
    await connectDB();

    const staff = await StaffModel.create({
      name: "Rahul",
      email: "rahul@example.com",
      password: "secret123",
      department: "sales",
    });

    console.log("created staff id:", staff._id.toString());
    console.log("stored password starts with hash:", staff.password.startsWith("$2"));
  } catch (error) {
    console.log(error.message);
  } finally {
    process.exit();
  }
};

run();
