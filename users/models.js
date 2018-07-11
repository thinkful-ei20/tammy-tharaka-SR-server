'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  head:{type: Number, default: 0},
  questions:[{
    _id: {type: mongoose.Schema.Types.Object, ref: 'Question'},
    question:{type: String},
    answer: {type: String},
    mValue: { type: Number, required: true, default : 1},
    next:{type: Number},
  }]
});

//Score key can be held to user is desired
//User.questions  = 
// [{key: A, next:1}, {key: B, next:2}, {key: C, next:3}, {key: D, next:4}, {key: E, next:5}];
 

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    _id: this._id || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

//const User =
module.exports= mongoose.model('User', UserSchema);

//module.exports = {User};
