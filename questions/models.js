'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// const QuestionSchema = new mongoose.Schema({
//     img: { 
//         type: String ,
//         required: true
//     },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// });

// QuestionSchema.index({ img: 1, userId: 1}, { unique: true });

// QuestionSchema.set('toObject', {
//     transform: function (doc, ret) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//     }
// });


module.exports = mongoose.model('Tag', tagSchema);

const QuestionSchema = mongoose.Schema({
// //   img: { 
// //     data: Buffer, 
// //     contentType: String
// //   },

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
    },
    next: {
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

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};