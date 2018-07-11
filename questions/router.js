'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const Question = require('./models');
const User = require('../users/models');

const router = express.Router();
const jsonParser = bodyParser.json();

const passport = require('passport');
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


//1. Seed a database
//Post questions:
//Create new question cards

router.post('/', jsonParser, (req, res, next) => {
  const userId = req.user._id;
  const {img, correctAnswer} = req.body;
  const newCard = {img, correctAnswer, userId};

  if (!img) {
    const err = new Error('Missing `img` in request body');
    err.status = 400;
    return next(err);
  }
  if (!correctAnswer) {
    const err = new Error('Missing `correctAnswer` in request body');
    err.status = 400;
    return next(err);
  }

  Question.create(newCard)
    .then(result =>{
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => res.status(500).json({message: 'Internal Server Error'}));
});


//2. router.get => request Take in userID, need to get first index of the array @ userID,  response = returns img url string, question string

router.get('/', jsonParser, (req, res, next) => {
  const userId = (req.user._id);
  //console.log(userId);

  User.findOne({_id: userId})
    .then(results => {
      //finds index of where first card is
      console.log(results);
      console.log(results.head);
      res.json(results.head);
    })
    .then()
    .catch(err =>{
      next(err);
    });


});

//3. router.put => request takes in userID, compares the input with the first index of array
//      if the answer is correct (req === answer[0]) if:
//          a. the card should be removed
//          b. the card should be put near the end of the list
//      if the answer is wrong
//          a. remove (spilice?) then insert it 2 spaces away from the top
//      response returns
//        img url string
//        answer string

router.put('/', jsonParser, (req,res,next) =>{
  const userId = (req.user._id);
  let userAnswer = req.body.correctAnswer;

  //defined outside to be comparable
  let head;
  User.findOne({_id: userId})
    .then(results => {
      console.log('this is user obj', results.questions);
      //finds index of where first card is
      //console.log(results.head);
      head = results.head;
      return results.head;
    })
    .then((head) => {
      //finds the card at the head index
      Question.findOne(head)
        .then(results => {
          console.log(results);
          return results.correctAnswer;  
        })
        .then((answer) => {
          if (userAnswer === answer){
            //console.log('this is user input', userAnswer);
            User.head = 
            res.json({message:'correct'});
          } else {
            //console.log('this is user input', userAnswer);
            res.json({message:'incorrect'});
          }
        })
        .catch(err =>{
          next(err);
        });
    });

});
//Utilize array indexes
//1. Set value at current node
//2. find location (current node, the one just answered)
//3. update user.head === curren node.next
//4. "insert at" by changing the next pointer

//m-value = current node


// [{key: A, next:1}, {key: B, next:2}, {key: C, next:3}, {key: D, next:4}, {key: E, next:5}];
//change the next pointer 

// look at {key: A, next:3} <= took c's pointer
//{key: C, next:0} <= took a's index
// [{key: A, next:1}, {key: B, next:2}, {key: C, next:0}, {key: D, next:4}, {key: E, next:5}];


// router.get('/user', jwtAuth, (req, res, next) => {

//   return Question.find( { $or: [ {"userId": req.user._id} ] } )
  
//     .then(questions => res.json(questions.map(ques => ques.serialize())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// }) 


module.exports = {router};