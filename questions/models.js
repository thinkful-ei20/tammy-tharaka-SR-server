'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({


  img: { 
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  }

});

QuestionSchema.methods.serialize = function() {
  return {
    img: this.img || null,
    correctAnswer: this.correctAnswer || '',
    userId: this.userId || '',
    _id: this._id || '',
    next: this.next || null
  };
};

module.exports = mongoose.model('Question', QuestionSchema);

