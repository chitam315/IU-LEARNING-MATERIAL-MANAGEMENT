import { catchAsync } from "../middlewares/async.js";
import Thesis from "../models/Thesis.js"
import ApiError from "../../utils/ApiError.js";
// import S3 from 'aws-sdk/clients/s3.js';
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3_ACCESS_KEY, S3_BUCKET_REGION, S3_SECRET_ACCESS_KEY } from "../../config/index.js";

const s3 = new AWS.S3({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_BUCKET_REGION,
});


const fileFilter = async (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype != "application/pdf") {
        // cb(null, true);
        cb(new ApiError(400, "Only PDF files are allowed"), false);

    } else {
        const existedThesis = await Thesis.findOne({ key: file.originalname })
        if (!existedThesis) {
            cb(null, true)
        } else {
            cb(new ApiError(400, "Thesis exist"), false);
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


class thesisController {

    // [POST] /thesis
    uploadThesis = async (req, res, next) => {
        const uploadSinge = upload('iu-document-system').single("file")

        uploadSinge(req, res, catchAsync(async (err) => {

            if (err instanceof ApiError) {
                console.log(err);
                res.status(err.statusCode).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                // Handle other errors
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            } else {
                console.log(req.file);
                try {
                    const thesisObj = await Thesis.create({
                        name: req.body.name,
                        path: req.file.location,
                        key: req.file.originalname,
                        category: req.body.category,
                        shortDescription: req.body.shortDescription
                    })
                    res.status(200).json({
                        success: true,
                        thesisObj
                    });
                } catch (error) {
                    console.log(error);
                    res.status(400).json({
                        success: false,
                        message: error?.message
                    })
                }

            }
        }))
    }

    // [DELETE] /thesis/:id
    deleteThesis = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const thesis = await Thesis.findById(id)
        if (!thesis) {
            throw new ApiError(400, "File does not exist")
        }
        await Thesis.deleteOne({ _id: id })

        console.log(thesis.key);
        s3.deleteObject({
            Bucket: 'iu-document-system',
            Key: thesis.key
        }, (err, data) => {
            console.log('err is : ', err);
            console.log('data is : ', data);
        })
        res.status(200).json({
            success: true,
        })

    })

    // [GET] /thesis
    getAllThesis = catchAsync(async (req, res, next) => {
        const thesisArr = await Thesis.find()
        res.status(200).json({
            success: true,
            thesisArr
        })
    })

    // [GET] /thesis/:id
    getThesisById = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const thesis = await Thesis.findById(id)
        if (!thesis) {
            throw new ApiError(400, 'This file does not exist')
        } else {
            res.status(200).json({
                success: true,
                thesis
            })
        }
    })

    // [PUT] /thesis/update
    updateThesis = catchAsync(async (req, res, next) => {
        const { _id, name, category, shortDescription } = req.body
        const thesis = await Thesis.findById(_id)
        if (!thesis) {
            throw new ApiError(400, 'This file does not exist')
        }
        thesis.name = name
        thesis.category = category,
        thesis.shortDescription = shortDescription
        try {
            await thesis.save()
            res.status(200).json({
                success: true
            })
        } catch (error) {
            throw error
        }

    })
}

export default new thesisController();