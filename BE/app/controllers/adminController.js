import bcyptjs from "bcryptjs";
import { catchAsync } from "../middlewares/async.js";
import User from "../models/User.js";
import ApiError from "../../utils/ApiError.js";

class adminController {

  // [DELETE] /delete/:id
  deleteUser = catchAsync(async (req, res, next) => {
    const username = req.params.username.toUpperCase()
    const existUser = await User.findOne({username})
    if (existUser) {
      await User.deleteOne({username})
      console.log('delete succesfully with username is : ',username);
      res.status(200).json({success: true})
    } else {
      throw new ApiError(400,"cannot find user")
    }
  });
}

export default new adminController();
