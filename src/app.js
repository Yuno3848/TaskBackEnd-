import express from "express";
import router from "./routes/registeredUser.routes.js";
import cookie from "cookie-parser";
const app = express();
app.use(cookie());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/user", router);

export default app;
