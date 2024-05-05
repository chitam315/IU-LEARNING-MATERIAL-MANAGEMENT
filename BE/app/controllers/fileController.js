import { catchAsync } from "../middlewares/async.js";
import File from "../models/File.js"
import ApiError from "../../utils/ApiError.js";
// import S3 from 'aws-sdk/clients/s3.js';
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import Course from "../models/Course.js";
import { S3_ACCESS_KEY, S3_BUCKET_REGION, S3_SECRET_ACCESS_KEY } from "../../config/index.js";

const s3 = new AWS.S3({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_BUCKET_REGION,
});


const fileFilter = async (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype != "application/pdf") {
        cb(new ApiError(400, "Only PDF files are allowed"), false);

    } else {
        const existedFile = await File.findOne({ name: file.originalname })
        if (!existedFile) {
            cb(null, true)
        } else {
            cb(new ApiError(400, "File exist"), false);
        }
    }
};

const upload = (bucketName) =>
    multer({
        storage: multerS3({
            s3,
            bucket: bucketName,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, `${file.originalname}`);
            },
        }),
        fileFilter
    })


class fileController {
    // [GET] /file/:filename

    // [POST] /file
    uploadFile = async (req, res, next) => {
        const uploadSingle = upload('iu-document-system').single("file")
        uploadSingle(req, res, catchAsync(async (err) => {
            if (err instanceof ApiError) {
                res.status(err.statusCode).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                // Handle other errors
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            } else {
                const course = await Course.findById(req.body.id)
                if (!course) {
                    res.status(404).json({
                        success: false,
                        message: 'course not found'
                    })
                    // throw new ApiError(404,'course not found')
                } else if (req.user.role == 'teacher' && course.teacher != req.user.id) {
                    res.status(401).json({
                        success: false,
                        message: 'You do not have permission'
                    })
                } else {
                    try {
                        const fileObj = await File.create({
                            name: req.file.originalname,
                            path: req.file.location,
                            course: course._id,
                            group: req.body.group,
                            title: req.body.title,
                            shortDescription: req.body.shortDescription,
                        })
                        course.files.push(fileObj)
                        course.markModified('files')
                        await course.save()
                        res.status(200).json({
                            success: true,
                            course: course
                        });
                    } catch (error) {
                        res.status(400).json({
                            success: false,
                            message: error?.message
                        })
                    }
                }
            }
        }))
    }

    // [DELETE] /FILE/:id
    deleteFile = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const file = await File.findById(id)
        if (!file) {
            throw new ApiError(400, "File does not exist")
        }
        const course = await Course.findById(file.course)
        if (!course) {
            throw new ApiError(400, "Course does not exist")
        }

        // Filter only admin and teacher of course
        if (req.user.role == 'teacher' && req.user.id != course.teacher) {
            throw new ApiError(400, "You do not have permission")
        } else {
            const index = course.files.indexOf(file._id);
            if (index < -1) {
                throw new ApiError(400, "Course does not contain file")
            }
            course.files.splice(index, 1);
            course.markModified('files')
            await course.save()
            await File.deleteOne({ _id: id })

            s3.deleteObject({
                Bucket: 'iu-document-system',
                Key: file.name
            }, (err, data) => {
                console.log('err is : ', err);
                console.log('data is : ', data);
            })
            res.status(200).json({
                success: true,
                course
            })
        }
    })

    // [PUT] /file/edit
    editFile = catchAsync(async (req,res,next) => {
        const {id,group,title,shortDescription} = req.body
        const file = await File.findById(id)
        if (!file) {
            throw new ApiError(400,'File does not exist')
        } else {
            file.group = group
            file.title = title
            file.shortDescription = shortDescription
            try {
                await file.save()
                res.status(200).json({
                    success: true
                })
            } catch (error) {
                throw new ApiError(400,error?.message)
            }
            
        }
    })

    getFileById = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const file = await File.findById(id)
        if (!file) {
            throw new ApiError(400, 'This file does not exist')
        } else {
            file.views = file.views + 1
            await file.save()
            res.status(200).json({
                success: true,
                file: file
            })
        }
    })

    getAllFile = catchAsync(async(req,res,next) => {
        const allFiles = await File.find().sort({ views: -1 }).populate('course')
        res.status(200).json({
            success: true,
            allFiles
        })

    })
}

export default new fileController();