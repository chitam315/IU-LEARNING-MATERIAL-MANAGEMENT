import mongoose from 'mongoose';

const thesisSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: {
      message: "Thesis's name is existed"
    }
  },
  shortDescription:{
    type: String,
    required: true,
    default: null
  },
  path: {
    type: String,
    required: true,
  },
  key:{
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['report form','timeline','thesis'],
    required: true,
  }
  // You can add more details specific to a file here
});

const Thesis = mongoose.model('Thesis', thesisSchema);

export default Thesis;
