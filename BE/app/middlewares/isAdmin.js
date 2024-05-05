import ApiError from "../../utils/ApiError.js"


const isAdmin = (req,res,next) => {
    if (req.user.role != "admin") {
        throw new ApiError(403,"You are not admin")
    }
    next()
}

export default isAdmin