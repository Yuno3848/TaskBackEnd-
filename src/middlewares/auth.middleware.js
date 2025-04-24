import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isLogged = (req, res, next) => {
  console.log("inside auth middleware");
  try {
    const token = req.cookies?.token;
    console.log("Token inside auth middleware:", token);
    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "failed to get credentials",
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded jwt cookie value :", decode);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Server(auth middleware) Internal Problem",
      error: error.message,
    });
  }
};
