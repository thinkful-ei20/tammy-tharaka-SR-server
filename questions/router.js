'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Question} = require('./models');
const {User} = require('../users/models');

const router = express.Router();
const jsonParser = bodyParser.json();

const passport = require('passport');
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


//sample user: 
// "username": "casey",
// "firstName": "",
// "lastName": "",
// "_id": "5b43c9d5445330563ce81cdf"

//"password": "casey12345"

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
  const userId = (req.user.id);
  User.findOne({userId})
    .then(results => {
      //give only the top card
      console.log(results);
      res.json(results.Question[results.head]);
    })
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
  const userId = (req.user.id);
  const {correctAnswer} = req.body;
  let answer;
  let currentCard;
  //User.findOne
  //Pick out question at head
  Question.find({userId})
    .then(results => {
      //give only the top card
      answer = results[0].correctAnswer;
      currentCard = results[0]._id;
    });
  if (correctAnswer === answer){
    //set head
    //head default at 0, if correct head is at 1
  }


});



// router.get('/user', jwtAuth, (req, res, next) => {

//   return Question.find( { $or: [ {"userId": req.user._id} ] } )
  
//     .then(questions => res.json(questions.map(ques => ques.serialize())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// }) 


module.exports = {router};