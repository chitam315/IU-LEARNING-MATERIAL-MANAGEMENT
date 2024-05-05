import { catchAsync } from "../middlewares/async.js"
import Message from "../models/Message.js"

class AnnouncementController {

    getAllMessage = catchAsync(async (req,res,next) => {
        const {id} = req.params
        const recipient = id
        const sender = req.user.id
        if (recipient == null) {
            res.status(200).json({
                success:true,
                messages: []
            })
        }
        const messages = await Message.find({
            sender: {$in: [recipient,sender]},
            recipient: {$in: [recipient,sender]}
        })
        res.status(200).json({
            success: true,
            messages
        })
    })
}

export default new AnnouncementController()