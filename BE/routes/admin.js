import express from "express";
const router = express.Router();
// import ApiError from "../utils/ApiError.js";
// import { catchAsync } from "../app/middlewares/async.js";

import adminController from "../app/controllers/adminController.js";
import jwtAuth from "../app/middlewares/jwtAuth.js";

router.delete(
  "/delete-user/:username",
  jwtAuth,
  adminController.deleteUser
);

export default router;
