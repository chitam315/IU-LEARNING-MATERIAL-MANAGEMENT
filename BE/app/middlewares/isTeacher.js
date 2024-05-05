import ApiError from "../../utils/ApiError.js"


const isTeacher = (req,res,next) => {
    if (req.user.role == "student") {
        throw new ApiError(403,"You do not have permission")
    }
    next()
}

export default isTeacher