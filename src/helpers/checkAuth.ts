const jwt = require("jsonwebtoken");
import { config } from "../config";

export const checkAuth = (authHeader: String) => {
  let userData;
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], config.JWT_KEY);
    userData = decoded;
  } catch (error) {
    console.log(error);
  }
  return userData;
};

export const checkAuthMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_KEY);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ message: "auth failed" });
  }

  next();
};
