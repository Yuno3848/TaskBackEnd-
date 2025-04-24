import { validationResult } from "express-validator";

export const validateError = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length == 0) {
    return next();
  }
  const arrayOfErros = [];
  console.log("user validation error:", errors);
  errors.forEach((err) => {
    arrayOfErros.push({ msg: err.msg, location: err.location });
  });

  return res.status(400).json({
    arrayOfErros,
  });
};
