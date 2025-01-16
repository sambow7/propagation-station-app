const mongoose = require('mongoose');

const careSchema = new mongoose.Schema({
  name: {type: String,required: true,},
  care: {type: String,},
  propagation: {type: Boolean,},
  cabinet: [plantSchema],
});

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});


module.exports = mongoose.model('Care', careSchema, 'Comment' , commentSchema);