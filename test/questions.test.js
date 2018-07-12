'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const Question = require('../questions/models');

const expect = chai.expect;
chai.use(chaiHttp);

describe.only('/api/questions', function (){
  const username = 'SallyIam';
  const password = 'ImaG8880888';
  const firstName = 'Sally';
  const lastName = 'Student';

  let token;

  before(function (){
    return runServer(TEST_DATABASE_URL);
  });

  after(function (){
    return closeServer();
  });

  //create a dummy user for auth token
  this.beforeEach(function(){
    return chai
      .request(app)
      .post('/api/users')
      .send({
        username,
        password,
        firstName,
        lastName
      })
      .then(() =>{
        return chai 
          .request(app)
          .post('/api/auth/login')
          .send({username, password})
          .then(res =>{
            token = res.body.authToken;
            console.log(token);
          });
      });
  });

  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });

});