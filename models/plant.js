const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  care: String,
  propagation: String,
  wateringFrequency: String,
  lighting: String,
  soil: String,
  coverImage: String,
  comments: [commentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;