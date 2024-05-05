import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'

import { catchAsync } from "../middlewares/async.js";
import ApiError from "../../utils/ApiError.js";
import { JWT_EXPIRES_ACCESS, JWT_SECRET_KEY, JWT_SECRET_REFRESH_KEY } from "../../config/index.js";
import User from "../models/User.js";
import File from "../models/File.js"

function generateMixedString(length) {
  let result = '';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const allChars = uppercaseChars + numbers;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    result += allChars.charAt(randomIndex);
  }

  return result;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: 'gmail',
  secure: true,
  auth: {
    user: "iudocumentsystem@gmail.com",
    pass: "tpbn quwo tbjz qkli",
  },
});

async function sendMailTo(receiver) {
  // send mail with defined transport object
  const code = generateMixedString(6)
  await transporter.sendMail({
    from: 'iudocumentsystem@gmail.com', // sender address
    to: receiver, // list of receivers
    subject: "Recover code", // Subject line
    text: `This code is use for changing your password ${code}`,
  });
  return code
}


class AuthController {
  // [GET] /all-users
  getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find()
    const userArr = users.map((user, index) => {
      if (index >= 1) {
        return {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          course: user.course
        }
      } else {

      }
    })
    res.status(200).json({
      success: true,
      users: userArr.slice(1)
    })
  })

  getPeople = catchAsync(async (req, res, next) => {
    const users = await User.find({}, { '_id': 1, username: 1 });
    res.status(200).json({
      success: true,
      people: users
    });

  })

  // [GET] /all-teachers
  getAllTeacher = catchAsync(async (req, res, next) => {
    const users = await User.find({ role: 'teacher' })
    const userArr = users.map((user, index) => {
      return {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        course: user.course
      }
    })
    res.status(200).json({
      success: true,
      users: userArr
    })
  })

  // [GET] /al-user-id
  getAllUserId = catchAsync(async (req, res, next) => {
    // try {
    //   const allUser = await User.find({}, '_id username fullName role')
    //   allUser.splice(0, 1)
    //   res.status(200).json({
    //     success: true,
    //     allUser
    //   })
    // } catch (error) {
    //   res.status(400).json({
    //     success: false,
    //     error: error.message
    //   })
    // }
    const users = await User.find()
    const allUser = users.map((user, index) => {
      return {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      }
    })
    allUser.splice(0,1)
    res.status(200).json({
      success: true,
      allUser
    })

  })

  // [POST] /login
  userLogin = catchAsync(async (req, res, next) => {
    var { username, password } = req.body;
    username = username.toUpperCase();
    const existedUser = await User.findOne({ username });
    if (!existedUser) {
      console.log('!existed User');
      throw new ApiError(400, "username is not valid");
    }

    const isMatch = bcryptjs.compareSync(password, existedUser.password);
    if (!isMatch) {
      throw new ApiError(400, " password is not valid");
    }
    const accessToken = await existedUser.getJwtAccessToken()
    const refreshToken = await existedUser.getJwtRefeshToken()
    existedUser.refresh_token = refreshToken
    existedUser.save().then(() => {
      res.status(200).json({ accessToken, refreshToken })
    })
      .catch((err) => {
        throw new ApiError(400, "Error when saving")
      })

  });

  refreshToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.headers.authorization.split(" ")[1];
    if (!refreshToken) {
      throw new ApiError(401, "Authorization failed")
    }
    const existedToken = await User.findOne({ refresh_token: refreshToken })
    if (!existedToken) {
      throw new ApiError(403, "Access denied")
    }
    // if (!refreshTokens.includes(refreshToken)) {
    //   throw new ApiError(403, "Access denied")
    // }
    try {
      const { id, role, username } = jwt.verify(refreshToken, JWT_SECRET_REFRESH_KEY, { ignoreExpiration: false })
      const newAccessToken = jwt.sign({ id, role, username }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_ACCESS })
      res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
      throw new ApiError(403, "Refresh token expired")
    }
  })

  // [POST] /register
  userRegister = catchAsync(async (req, res) => {
    var { username, password, role, email, fullName } = req.body;
    const user = new User({
      username: username.toUpperCase(),
      password,
      email,
      role,
      fullName
    });
    await user.save().then(() => res.status(201).json({ success: true }));
  });

  // [PUT] /update-password
  updatePassword = catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { username } = req.user
    const user = await User.findOne({ username: username.toUpperCase() });
    const isMatch = bcryptjs.compareSync(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Old password is not correct");
    }
    try {
      user.password = newPassword;
      await user.save();
      res.status(200).json({
        success: true
      })
    } catch (error) {
      throw new ApiError(400, error.message)
    }

  });

  // [PUT] /update-email
  updateEmail = catchAsync(async (req, res, next) => {
    const { newEmail } = req.body;
    const username = req.user.username
    try {
      const user = await User.findOne({ username })
      user.email = newEmail
      await user.save()
      res.status(200).json({ success: true });
    } catch (error) {
      throw new ApiError(400, error.message)
    }
  });

  // [PUT] /update-information ( only admin )
  updateInformation = catchAsync(async (req, res, next) => {
    const { username, fullName, email, role } = req.body
    try {
      const user = await User.findOne({ username: username.toUpperCase() })
      user.fullName = fullName
      user.email = email
      user.role = role
      await user.save()
      res.status(200).json({
        success: true
      })
    } catch (error) {
      throw new ApiError(400, error.message)
    }
  })

  // [PUT] /update-personal
  updatePersonalInformation = catchAsync(async (req, res, next) => {
    const { fullName, email } = req.body
    const { username } = req.user
    const user = await User.findOne({ username })
    user.fullName = fullName
    user.email = email
    await user.save()
    res.status(200).json({
      success: true
    })
  })

  // [DELETE] /delete-user ( only admin )
  deleteUser = catchAsync(async (req, res, next) => {
    const { username } = req.params
    try {
      await User.findOneAndDelete({ username })
      res.status(200).json({ success: true })
    } catch (error) {
      throw new ApiError(400, error.message)
    }
  })

  // [POST] /send-email
  sendEmail = catchAsync(async (req, res, next) => {
    const { username } = req.body
    const user = await User.findOne({ username: username.toUpperCase() })
    if (!user) {
      throw new ApiError(400, 'username does not exist')
    }
    const recoverCode = await sendMailTo(user.email)
    user.recoverCode = recoverCode
    await user.save()
    res.status(200).json({
      success: true,
      email: user.email
    })
  })

  changePasswordWithCode = catchAsync(async (req, res, next) => {
    const { username, recoverCode, newPassword } = req.body
    const user = await User.findOne({ username: username.toUpperCase() })
    if (!user) {
      throw new ApiError(400, 'username does not exist')
    }
    if (recoverCode == user.recoverCode) {
      user.password = newPassword
      user.recoverCode = null
      await user.save()
      res.status(200).json({
        success: true
      })
    } else {
      throw new ApiError(400, 'Code is wrong')
    }
  })

  addToWishList = catchAsync(async (req, res, next) => {
    const { fileId } = req.body
    const user = await User.findOne({ username: req.user.username })
    if (!user) {
      throw new ApiError(400, 'Cannot find user')
    }
    try {
      const file = await File.findById(fileId)
      if (!file) {
        throw new ApiError(400, 'Cannot find this file')
      }
      user.wishList.push(file)
      user.markModified('wishList')
      await user.save()
      res.status(200).json({ success: true })
    } catch (error) {
      throw new ApiError(400, error.message)
    }
  })

  readWishList = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ username: req.user.username }).populate('wishList')
    if (!user) {
      throw new ApiError(400, 'Cannot find user')
    } else {
      res.status(200).json({
        success: true,
        wishList: user.wishList
      })
    }
  })

  removeFromWishList = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findOne({ username: req.user.username })
    const index = user.wishList.indexOf(id)
    if (index < 0) {
      throw new ApiError(400, 'There is no file in wishlist')
    }
    user.wishList.splice(index, 1)
    user.markModified('wishList')
    await user.save()
    res.status(200).json({ success: true })
  })
}

export default new AuthController();
