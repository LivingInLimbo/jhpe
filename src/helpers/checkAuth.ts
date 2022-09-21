const jwt = require("jsonwebtoken");
import { config } from "../config";
import Express from "express";

export const checkAuth = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_KEY);
    //req.userData = decoded;
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "auth failed" });
  }

  next();
};
