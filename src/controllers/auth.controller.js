import { Users } from "../models/user.models.js";
import { fileUploadOnCloudinary } from "../utils/cloudinary.js";
import { generateMail, sendMail, forgotPasswordMail } from "../utils/mail.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cookie from "cookie-parser";
import { hash } from "bcrypt";
export const registeredUser = async (req, res) => {
  console.log("hello inside registered ");
  //fetch user details
  const { email, username, fullname, password } = req.body;
  console.log(
    `email: ${email}, username : ${username}, fullname: ${fullname}, password: ${password}`,
  );
  //check whether this user already exists or not

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: true,
        message: "user already exists",
        data: {
          username: existingUser.username,
          email: existingUser.email,
          fullname: existingUser.fullname,
        },
      });
    }
    //avatar
    console.log(req?.file);

    const fileUplodation = await fileUploadOnCloudinary(req.file?.path);
    if (!fileUplodation) {
      return res.status(400).json({
        status: "failed",
        message: "failed to upload",
      });
    }
    const user = await Users.create({
      email,
      username,
      fullname,
      password,
      avatar: {
        type: {
          url: fileUplodation.url,
          localpath: req?.file?.path,
        },
      },
    });
    if (!user) {
      return res.status(500).json({
        status: "failed",
        message: "failed to create user....",
      });
    }

    const { unhashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();
    console.log(
      `hashed token : ${hashedToken}, unhashed token ${unhashedToken}`,
    );
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();
//options
    await sendMail({
      username: user.username,
      email: user.email,
      subject: "user verification ",
      mailGenContent: generateMail(
        user.username,
        `http://localhost:8000/api/v1/user/verify/${unhashedToken}`,
      ),
    });
    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for verification.",
      data: {
        name: user.name,
        email: user.email,
        verificationSent: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "false",
      message: "Internal server problem",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("verification token :", token);
    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Token Not Found...",
      });
    }

    const emailVerificationToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await Users.findOne({
      emailVerificationToken,
      emailVerificationTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "user not found",
      });
    }

    user.emailVerificationToken = "";
    user.emailVerificationTokenExpiry = "";
    user.isEmailVerified = true;
    await user.save();
    return res.status(201).json({
      status: "success",
      message: "email verified",
      data: {
        isEmailVerified: user.isEmailVerified,
        username: user.name,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Server Internal Problem",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //check wether this email exists or not in the database
  //if not return "user not exists"
  //if exists, then compare the password with the hashed password
  //if password matches then user logged in succesfull
  //if not then return "password wrong try again"

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        error: "Invalid credentials",
        message: "|username| or password incorrect",
      });
    }

    const isPassword = bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        status: "failed",
        error: "Invalid credentials",
        message: "username or |password| incorrect",
      });
    }
    //send cookie

    const Token = user.generateAccessToken();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", Token, cookieOptions);
    return res.status(201).json({
      status: "success",
      message: "user successfully logged In...",
      data: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Server Internal Problem",
      error: error.message,
    });
  }
};

export const logOutUser = async (req, res) => {
  res.clearCookie();

  try {
    return res.status(201).json({
      status: "success",
      message: "logOut successfully...",
      data: {
        username: req.user?.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Server Internal Problem",
    });
  }
};

export const getProfile = async (req, res) => {
  // const user = await Users.findById({req.user.id})
  try {
    const user = await Users.findById(req.user.id).select("-password");
    console.log("user", user);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "user not found, Invalid credentials",
      });
    }
    return res.status(400).json({
      status: "success",
      message: "profile fetched successfully",
      data: {
        username: user.name,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Server Internal Problem",
      error: error.message,
    });
  }
};

export const resendVerifyEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(
      `resendVerifyEmail email: ${email} , resendVerifyEmail password: ${password}`,
    );

    const user = await Users.findOne({ email });
    console.log("resend verify email user", user);

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
        error: "Invalid Credentials",
      });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({
        status: "failed",
        message: "user already verified",
      });
    }

    const { unhashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();

    await sendMail({
      email: user.email,
      subject: "Reverification email",
      mailGenContent: generateMail(
        user.username,
        `http://localhost:8000/api/v1/user/reverify/${unhashedToken}`,
      ),
    });

    res.status(201).json({
      success: true,
      message: "Please check your email for Re-verification.",
      data: {
        name: user.username,
        email: user.email,
        verificationSent: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Server Internal Problem",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Email",
        error: "Invalid Credential",
        data: {
          message: "failed to fetched user information",
        },
      });
    }

    const { unhashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;
    await user.save();

    await sendMail({
      username: user.username,
      email: user.email,
      subject: "forgot password link",
      mailGenContent: forgotPasswordMail(
        user.username,
        `http://localhost:8000/api/v1/user/resetpassword/${unhashedToken}`,
      ),
    });

    return res.status(201).json({
      status: "success",
      message: "forgot password link has been sent",
      data: {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params; //get token from the params
  const { password } = req.body;
  const tempToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(
    ` unhashedToken: ${token}, hashedToken : ${tempToken} , password : ${password} `,
  );
  try {
    const user = await Users.findOne({
      forgotPasswordToken: tempToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Email",
        error: "Invalid Credential",
        data: {
          message: "failed to fetched user information",
        },
      });
    }

    user.password = password;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();

    return res.status(201).json({
      status: "success",
      message: "Reset Password Successful",
      data: {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
