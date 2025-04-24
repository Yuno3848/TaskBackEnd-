import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({
  path: "./../.env",
});
export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connecing to database...");
  } catch (error) {
    console.log("error while connecting db :", error);
    console.log("Error while connecting database...");
  }
};

