import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: {
      message: "Course code is existed"
    },
    required: [true, "Course code is required"],
  },
  name: {
    type: String,
    unique: {
      message: "Course name is existed"
    },
    required: [true, "Course name is required"],
  },
  major: {
    type: [String],
    enum: ['CE', 'CS', 'NE'],
    required: true,
  },
  category: {
    type: String,
    enum: ['compulsory', 'elective', 'general'],
    required: true,
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  }],
  referenceLinks: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true },
      // Add more properties as needed
    }
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
  // You can add more details specific to a course here
}, { minimize: false });

const Course = mongoose.model('Course', courseSchema);

export default Course;
