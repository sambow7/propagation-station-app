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
  propagation: {
    type: String,
    required: true
  },
  watering: String,
  lighting: String,
  soil: String,
  care: String,
  coverImage: String,
  comments: [commentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;