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
    .then(card =>{
      res.location(`${req.originalUrl}/${card.id}`)
        .status(201)
        .json(card);
    })
    .catch(err => res.status(500).json({message: 'Internal Server Error'}));
});


//2. GET first card
//router.get => request Take in userID, displays img source at the head

router.get('/', jsonParser, (req, res, next) => {
  const userId = (req.user._id);
  //console.log(userId);
  User.findOne({_id: userId})
    .then(user => {
      if (user.head >= user.questions.length){
        user.head = 0;
      }
      return user.save();
    })
    .then(user => {
      //console.log(user.head);
      let question = user.questions[user.head].question;
      res.json(question);
    })
    .then()
    .catch(err =>{
      next(err);
    });
});

//3. GET next card
router.get('/next', jsonParser, (req, res, next) => {
  const userId = (req.user._id);
  //console.log(userId);
  
  User.findOne({_id: userId})
    .then(user => {
      let currentIndex = user.head;
      let currentNode = user.questions[currentIndex];
      let nextIndex; 

      if (currentNode.next >= user.questions.length) {
        nextIndex = 0;
        //if end of stack reached, return to the first index of array...
      } else {
        nextIndex = currentNode.next;
      }
      console.log('next index is', nextIndex);

      user.head = nextIndex;
      return user.save();
    })
    .then(user => {
      let head = user.head;
      let question = user.questions[head].question;
      res.json(question);
    })
    .then()
    .catch(err =>{
      next(err);
    });
});

//4 PUT to answer question
//  Check answer & make adjustments
//      a. ANSWER CORRECT
//          if the answer is correct (req === answer[0])
//          mValue (memory value)
//          i. the card should be put near the end of the list
//          ii. Return res.json message of correct
//      b. ANSWER INCORRECT
//          i. the mValue card should be 1 space away from previous
//          ii. Return res.json of incorrect

//Utilize array indexes
//1. Set value at current node
//2. find location (current node, the one just answered)
//3. update user.head === curren node.next
//4. "insert at" by changing the next pointer

//m-value = how many spaces to move node

router.put('/', jsonParser, (req,res,next) =>{
  const userId = (req.user._id);
  let userAnswer = req.body.correctAnswer;
  let correctAnswer;
  let message;

  if (!correctAnswer) {
    const err = new Error('Missing `correctAnswer` in request body');
    err.status = 400;
    return next(err);
  }

  User.findOne({_id: userId})
    .then(user => {
      const currentIndex = user.head;
      console.log(user.head);
      const answeredQuestion = user.questions[currentIndex];
      correctAnswer = answeredQuestion.answer;
      console.log('this is the correct answer', correctAnswer);

      //EXAMPLE:  
      //answeredQuestion =
      // [{key: A, next:1, mValue: 1, next: 1}, 

      //compare if user input === whats stored in db
      if (userAnswer === correctAnswer) {
        //mValue higher if correct (further down in array)
        answeredQuestion.mValue  = answeredQuestion.mValue * 3;
        message = 'correct';
        console.log('updated mValue', answeredQuestion.mValue);

        //EXAMPLE: 
        // {key: A, next:1, mValue: 3 }, 
      } else {
        //if answer is incorrect, mValue reset to one
        answeredQuestion.mValue = 1;
        message = 'incorrect';
        console.log('updated mValue', answeredQuestion.mValue);

        //EXAMPLE: 
        // [{key: A, next:1, mValue: 1},
      }

      user.head = answeredQuestion.next;

      console.log('answeredQuestion', answeredQuestion);
      //Find insertion point
      //Original head index + the memory spaces(mValue) to move
      let newIndex = currentIndex + answeredQuestion.mValue;
      //if the newIndex is beyond the array length reset to zero?
      if (newIndex >= user.questions.length){
        newIndex = 0;
      }
      console.log('newIndex', newIndex);

      //
      const currentQuestion = user.questions[newIndex];
      console.log('moving to node', currentQuestion);

      //const answeredQuestionIndex = answeredQuestion.next;
      answeredQuestion.next = currentQuestion.next;
      currentQuestion.next = currentIndex;

      return user.save();
    })
    .then(() => {
      console.log(message);
      console.log(correctAnswer);
      //should return answer, and correct or incorrect
      res.json({correctAnswer, message});
    })
    .then()
    .catch(err =>{
      next(err);
    });
});
      

// [{key: A, next:1}, {key: B, next:2}, {key: C, next:3}, {key: D, next:4}, {key: E, next:5}];
//change the next pointer 

// look at {key: A, next:3} <= took c's pointer
//{key: C, next:0} <= took a's index
// [{key: A, next:1}, {key: B, next:2}, {key: C, next:0}, {key: D, next:4}, {key: E, next:5}];


module.exports = {router};