import ApiError from "../../utils/ApiError.js"


const authen = (req,res,next) => {
    const { username } = req.body
    if (username.toUpperCase() != req.user.username) {
        throw new ApiError(401,"You are not authenticated")
    }
    next()
}

export default authen