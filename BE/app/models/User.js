import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, JWT_SECRET_REFRESH_KEY, JWT_EXPIRES_ACCESS, JWT_EXPIRES_REFRESH } from '../../config/index.js'

const schema = mongoose.Schema;

const UserSchema = new schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username is required"],
    min: [6, "username must be at least 6 characters"],
    max: [11, "username must be less than or equal 11 character"],
  },
  fullName: {
    type: String,
    required: [true,"Full name is required"]
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  refresh_token: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  role: {
    type: String,
    enum: ["admin", "student", "teacher"],
    require: [true, "This field is required"],
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  announcements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announcement'
    }
  ],
  recoverCode: {
    type: String,
    default: null
  },
  wishList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
},{minimize: false});

UserSchema.methods.getJwtAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, username: this.username, fullName: this.fullName, email: this.email },
    JWT_SECRET_KEY,
    {
      expiresIn: JWT_EXPIRES_ACCESS,
    }
  );
};

UserSchema.methods.getJwtRefeshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, username: this.username },
    JWT_SECRET_REFRESH_KEY,
    {
      expiresIn: JWT_EXPIRES_REFRESH,
    }
  );
};

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    // console.log('password modified');
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(this.password, salt);
    this.password = hashedPassword;
  }
  next();

});

export default mongoose.model("User", UserSchema);
