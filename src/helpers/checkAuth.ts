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
