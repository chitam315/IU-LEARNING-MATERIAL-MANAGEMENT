import jwt from 'jsonwebtoken'
// const SendmailTransport = require("nodemailer/lib/sendmail-transport");

import ApiError from '../../utils/ApiError.js';
import { JWT_SECRET_KEY } from '../../config/index.js';
/**
 * this middleware is used to check authentication for private activities
 */
const jwtAuth = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const token = headerToken.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    console.log({...error});
    if (error.name === "TokenExpiredError") {
      throw new ApiError(403, "Token is expired!");
    }
    throw new ApiError(401, "Unauthorized");
  }
};

export default jwtAuth