'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
//   img: { 
//     data: Buffer, 
//     contentType: String
//   },
//   questions: {
//      
//   }

  img: { 
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
});

QuestionSchema.methods.serialize = function() {
  return {
    img: this.img || '',
    userId: this.userId || '',
    _id: this._id || ''
  };
};

const Question = mongoose.model('Event', QuestionSchema);

module.exports = {Question};