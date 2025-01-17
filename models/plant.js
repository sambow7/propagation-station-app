const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

const plantSchema = new mongoose.Schema({
  title: String,
  author: String,
  comments: [commentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;