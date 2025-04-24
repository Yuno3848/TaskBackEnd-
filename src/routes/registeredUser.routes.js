import express from "express";
import {
  registeredUser,
  loginUser,
  getProfile,
  logOutUser,
  verifyEmail,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { userRegValidate } from "../validator/validator.js";
import { validateError } from "../middlewares/validator.middleware.js";
import { isLogged } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/registereduser",
  upload.single("avatar"),
  userRegValidate(),
  validateError,
  registeredUser,
);
router.get("/getprofile", isLogged, getProfile);
router.get("/login", loginUser);
router.get("/verify/:token", verifyEmail);
router.get("/logout", isLogged, logOutUser);
router.get("/reverify", resendVerifyEmail);
router.get("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
export default router;
