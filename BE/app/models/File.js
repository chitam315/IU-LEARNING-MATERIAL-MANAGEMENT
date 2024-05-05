import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  group: {
    required: [true,'group is required'],
    type: String,
    enum: ['syllabus','lesson','reference']
  },
  shortDescription:{
    type: String,
    required: true,
    default: null
  },
  title: {
    type: String,
    required: true,
    default: null
  },
  views: {
    type: Number,
    default: 0
  }
  // You can add more details specific to a file here
},{minimize: false});

const File = mongoose.model('File', fileSchema);

export default File;
