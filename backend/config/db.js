const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" ✔ database connected");
  } catch (error) {
    throw new Error(error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
