import { db } from "./utils/index.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import app from "./app.js";
dotenv.config();

const PORT = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const handleCors = {
  origin: process.env.BASE_URL,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(handleCors));

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database Successfully Connected ${PORT}...`);
    });
  })
  .catch((error) => {
    console.log("Database Connectivity Failed :", error);
    console.log("Connected Failed...");
    console.log("Try Again..");
  });
