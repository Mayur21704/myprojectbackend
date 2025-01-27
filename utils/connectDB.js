const mongoose = require("mongoose");

// const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL = "mongodb://localhost:27017/";

const connectDB = async () => {
  try {
    mongoose
      .connect(MONGO_URL)
      .then(() => console.log("Database connected successfully"))
      .catch(() => console.error("Database connection error:", error));
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connectDB;
