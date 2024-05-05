import ApiError from "../../utils/ApiError.js";
import { catchAsync } from "../middlewares/async.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import File from "../models/File.js";

class courseController {
  // [POST] /course/create-course
  createCourse = catchAsync(async (req, res, next) => {
    var { name, code, major, category, referenceLinks } = req.body;
    const course = new Course({ name, code, major, category, referenceLinks });
    await course.save().then(() => res.status(201).json({ success: true }));
  });

  // [GET] /course
  getAllCourse = catchAsync(async (req, res, next) => {
    const courses = await Course.find().populate('teacher')
    res.status(200).json(courses)
  })

  // [GET] /course/:id/
  getCourse = catchAsync(async (req, res, next) => {
    var { id } = req.params;
    try {
      const course = await Course.findById(id).populate('files').populate('teacher')
      res.json({
        success: true,
        course
      })
    } catch (error) {
      res.status(400).send(error.message)
    }
  })

  // [PUT] /course/update/:id
  updateCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const course = await Course.findById(id)
    const { name, code, major, category, referenceLinks } = req.body;

    // Filter only admin and teacher of course
    if (req.user.role == 'teacher' && req.user.id != course.teacher) {
      throw new ApiError(400, "You do not have permission")
    } else {
      course.name = name
      course.code = code
      course.major = major
      course.category = category
      course.referenceLinks = referenceLinks
      await course.save()
      res.status(200).json({
        success: true
      })
    }
  })

  // [PUT] /course/:id/change-teacher
  changeTeacher = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { idTeacher } = req.body
    const course = await Course.findById(id)
    course.teacher = idTeacher
    await course.save()
    res.status(200).json({ success: true })
  })

  // [DELETE] /course/delete/:code
  deleteCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params
    try {
      const course = await Course.findById(id)
      for (const file of course.files) {
        if (file) {
          await File.findByIdAndDelete(file);
        }
      }
      await Course.findByIdAndDelete(id)
      res.status(200).json({ success: true })
    } catch (error) {
      throw new ApiError(400, error.message)
    }
  });
}

export default new courseController();
