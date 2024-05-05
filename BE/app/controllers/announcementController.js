import ApiError from "../../utils/ApiError.js"
import { catchAsync } from "../middlewares/async.js"
import Announcement from "../models/Announcement.js"
import User from "../models/User.js"

class AnnouncementController {
    // [POST] /announcement
    createAnnouncement = catchAsync(async (req, res, next) => {
        const { title, shortDescription, link, userIdArr, isAll } = req.body
        const announce = new Announcement({ title, shortDescription, link, users: userIdArr, isAll })
        try {
            await announce.save()
            const users = await User.find({ _id: { $in: userIdArr } })
            for (const user of users) {
                user.announcements.push(announce)
                user.markModified('announcements')
                await user.save()
            }
            res.status(200).json({
                success: true
            })
        } catch (error) {
            res.status(400, {
                success: false
            })
        }
    })

    // [GET] /announcement/
    getAnnouncements = catchAsync(async (req, res, next) => {
        if (req.user.role == 'admin') {
            const allAnnounce = await Announcement.find().populate('users', '_id username')
            res.status(200).json({
                success: true,
                allAnnounce
            })
        } else {
            const { username } = req.user
            const user = await User.findOne({ username }).populate('announcements')
            res.status(200).json({
                success: true,
                allAnnounce: user.announcements
            })
        }

    })

    deleteAnnouncements = catchAsync(async (req, res, next) => {
        const { id } = req.params
        await Announcement.findByIdAndDelete(id)
        res.status(200).json({
            success: true
        })
    })
}

export default new AnnouncementController()