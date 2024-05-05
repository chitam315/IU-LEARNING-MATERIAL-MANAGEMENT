import fs from "fs";
import { catchAsync } from "../middlewares/async.js";

class StudentController {
  // [PATCH] /update-password
  updatePassword = catchAsync(async (req, res, next) => {
    const { username, oldPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ username });
    const isMatch = bcyptjs.compareSync(oldPassword, admin.password);
    if (!isMatch) {
      throw new ApiError(400, "Old password is not correct");
    } else {
      admin.password = newPassword;
      await admin.save();
      res.status(200).json({ success: true });
    }
  });

  // [PATCH] /update-email
  updateEmail = catchAsync(async (req, res, next) => {
    const { username, newEmail } = req.body;
    const admin = await Admin.findOneAndUpdate({ username }, { email });
    res.status(200).json({ success: true });
  });
}

export default new StudentController();
