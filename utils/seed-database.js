'use strict';
const mongoose = require('mongoose');

const {DATABASE_URL} = require('../config');

const Question = require('../questions/models');
const User = require('../users/models');

const seedQuestions = require('../db/questions.json');
const seedUsers = require('../db/users.json');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    const hashPasswords = seedUsers.map ( user => {
      return  User.hashPassword(user.password);
      
    });
    return Promise.all(hashPasswords);
  })

  //.then(results => console.log(results))
  .then((results) => {
    seedUsers.forEach((user,i) => user.password = results[i]);
    //i in forEach can iterate
    return Promise.all([
      Question.insertMany(seedQuestions),
      Question.createIndexes(),
      User.insertMany(seedUsers),
      User.createIndexes(),

    ]);

  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });