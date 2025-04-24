import { body } from "express-validator";

export const userRegValidate = () => {
  console.log("inside validation of user");
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username can't be empty")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters")
      .isLength({ max: 15 })
      .withMessage("Username can't be greater than 15 characters")
      .isLowercase()
      .withMessage("Username must be lowercase"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email can't be empty")
      .isEmail()
      .withMessage("Please provide a valid email address"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password can't be empty")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),

    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Full name can't be empty")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters")
      .isLength({ max: 50 })
      .withMessage("Full name can't be greater than 50 characters"),
  ];
};
