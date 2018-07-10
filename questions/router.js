'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const {Question} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});

//Get questions
// router.get('/', jwtAuth, (req, res,) => {
//   return Question.find()
//     .then(questions => res.json(questions.map(ques => ques.serialize())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });



//1. router.get => request Take in userID, need to get first index of the array @ userID,  response = returns img url string, question string

// 2. router.put => request takes in userID, compares the input with the first index of array
//      if the answer is correct (req === answer[0]) if:
//          a. the card should be removed
//          b. the card should be put near the end of the list
//      if the answer is wrong
//          a. remove (spilice?) then insert it 2 spaces away from the top

router.get('/user', jwtAuth, (req, res, next) => {

  return Question.find( { $or: [ {"userId": req.user._id} ] } )
  
    .then(questions => res.json(questions.map(ques => ques.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
}) 

// router.patch('/:id', jsonParser, jwtAuth, (req, res, next) => {
//   const acceptUserId = req.user._id;
//   const { id } = req.params;

//   const updateEvent = {
//     title: req.body.title,
//     hours: req.body.hours,
//     pay: req.body.pay,
//     userId: req.body.userId,
//     acceptUserId: acceptUserId
//   };

//     Event.findByIdAndUpdate(id, updateEvent, {
//       new: true
//     })
//     .then(event => {
//       if (event) {
//         res.json(event);
//       } else {
//         next();
//       }
//     })

//   .catch(err => res.status(500).json({message: 'Internal server error'}));
// }) 

// router.delete('/:id', jsonParser, jwtAuth, (req, res, next) => {

//   const { id } = req.params;

//     Event.findByIdAndRemove(id)
//     .then(result => {
//       if (result) {
//         res.status(204).end();
//       } else {
//         next();
//       }
//     })

//   .catch(err => res.status(500).json({message: 'Internal server error'}));
// }) 


// Post a new Event
// router.post('/', jsonParser, jwtAuth, (req, res) => {
//     const userId = req.user._id;
//     const requiredFields = ['title', 'hours', 'pay'];
//     const missingField = requiredFields.find(field => !(field in req.body));
  
//     if (missingField) {
//       return res.status(422).json({
//         code: 422,
//         reason: 'ValidationError',
//         message: 'Missing field',
//         location: missingField
//       });
//     }
  
//     const stringFields = ['title', 'hours', 'pay'];
//     const nonStringField = stringFields.find(
//       field => field in req.body && typeof req.body[field] !== 'string'
//     );
  
//     if (nonStringField) {
//       return res.status(422).json({
//         code: 422,
//         reason: 'ValidationError',
//         message: 'Incorrect field type: expected string',
//         location: nonStringField
//       });
//     }
 

//     const event = new Event({
//         _id: new mongoose.Types.ObjectId(),
//         title: req.body.title,
//         hours: req.body.hours,
//         pay: req.body.pay,
//         userId: userId,
//         acceptUserId: null
//       });



//     event.save().then(result => {
//         console.log(result);
//         res.status(201).json({
//          message: 'Handling POST requests to /events',
//          createEvent: result
//        });
//     })

  
//       .catch(err => {
//         res.status(500).json({code: 500, message: 'Internal server error'});
//       });
//   });

  module.exports = {router};