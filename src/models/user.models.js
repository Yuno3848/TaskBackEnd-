import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localpath: String,
      },
      default: {
        url: "",
        localpath: "",
      },
    },
    username: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    fullname: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: String,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" },
  );
};

userSchema.methods.generateRefreshAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.SECRET_REFRESH_KEY,
    { expiresIn: "24h" },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unhashedToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000;
  return { unhashedToken, hashedToken, tokenExpiry };
};
export const Users = mongoose.model("Users", userSchema);
