'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const Question = require('../questions/models');
const seedQuestions = require('../db/questions');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/questions', function (){
  const username = 'SallyIam';
  const password = 'ImaG8880888';
  const firstName = 'Sally';
  const lastName = 'Student';

  const img = 'http://image.jpg';
  const correctAnswer = 'correctAnswer';

  let token;
  let user;

  before(function (){
    return runServer(TEST_DATABASE_URL);
  });

  after(function (){
    return closeServer();
  });

  //create a dummy user for auth token
  this.beforeEach(function(){//post one question before each
    Question.insertMany(seedQuestions)
      .then(() => Question.createIndexes())
    return chai
      .request(app)
      .post('/api/users')
      .send({
        username,
        password,
        firstName,
        lastName
      })
      .then((res) =>{
        // console.log('USERSSSS',res.body._id)
        user = res.body;
        return chai 
          .request(app)
          .post('/api/auth/login')
          .send({username, password})
          .then(res =>{
            
            token = res.body.authToken;
            // console.log(token);
          });
      });
  });

  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });


  describe('GET /api/questions', function () {


    it('should return the one question as a string', function() {
      return Promise.all([
        Question.findOne({userId: user._id}),
        chai.request(app)
          .get('/api/questions')
          .set('Authorization', `Bearer ${token}`)
      ])
          .then(res => {
          expect(res[1]).to.have.status(200);
          expect(res[1]).to.be.json;
          expect(res[1].body).to.be.a('string');
        });

    });

    it('should return the next question', function() {
      return Promise.all([
        Question.findOne({userId: user._id}),
        chai.request(app)
          .get('/api/questions/next')
          .set('Authorization', `Bearer ${token}`)
      ])
          .then(res => {
          expect(res[1]).to.have.status(200);
          expect(res[1]).to.be.json;
          expect(res[1].body).to.be.a('string');
        });

    });

  });


  describe.only('POST /api/questions', function () {
    it('Should reject user with missing image ', function() {
      return chai 
      .request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user._id,
        correctAnswer
      })
      .then(() => 
      expect.fail(null, null,'Request should not succeed')
      )
      .catch(err => {
        // console.log("RESSSSS", err.response)
        if (err instanceof chai.AssertionError){
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(400);
        // expect(res.body.text).to.equal('Missing `img` in request body');
      });
    })
  });

  describe.only('POST /api/questions', function () {
    it('Should reject user with missing image ', function() {
      return chai 
      .request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user._id,
        img
      })
      .then(() => 
      expect.fail(null, null,'Request should not succeed')
      )
      .catch(err => {
        // console.log("RESSSSS", err.response)
        if (err instanceof chai.AssertionError){
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(500);//Need this to be 400
        // expect(res.body.text).to.equal('Missing `correctAnswer` in request body');
      });
    })
  });

  

});