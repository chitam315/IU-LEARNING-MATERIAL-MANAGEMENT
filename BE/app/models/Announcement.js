import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    default: ''
  },
  shortDescription:{
    type: String,
    required: true,
    default: ''
  },
  link: {
    type: String,
    // required: true,
    default: '',
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isAll: {
    type: String,
    enum: ['user','student','teacher','none'],
    default: 'none'
  }
  // You can add more details specific to a file here
},{minimize: false, timestamps: true});

export default mongoose.model("Announcement", announcementSchema);

