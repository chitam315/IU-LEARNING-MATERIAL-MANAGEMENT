import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: String
},{minimize: false, timestamps: true});

export default mongoose.model("Message", messageSchema);

