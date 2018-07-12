'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const User = require('../users/models');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/user', function () {
  const username = 'SallyIam';
  const password = 'ImaG8880888';
  const firstName = 'Sally';
  const lastName = 'Student';

  before(function (){
    return runServer(TEST_DATABASE_URL);
  });

  after(function (){
    return closeServer();
  });

  afterEach(function (){
    return User.remove({});
  });

  describe('api/users', function () {
    describe('POST', function () {
      it('Should reject user with missing username', function (){
        return chai 
          .request(app)
          .post('/api/users')
          .send({
            password,
            firstName,
            lastName
          })
          .then(() => 
            expect.fail(null, null,'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError){
              throw err;
            }
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });
    });
    it('Should create a new user', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({
          username,
          password,
          firstName,
          lastName
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            '_id',
            'username',
            'firstName',
            'lastName'
          );
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
          return user.validatePassword(password);
        })
        .then(passwordIsCorrect => {
          expect(passwordIsCorrect).to.be.true;
        });
    });
  });
});
