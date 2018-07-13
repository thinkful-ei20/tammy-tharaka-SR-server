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

    it('Should reject users with missing username', function () {
      const testUser = { password };
      return chai.request(app).post('/api/users').send(testUser)
        .catch(err => err.response)//return err.response but dont need return because of the arrow function
        .then(res => {
          //console.log('BODY', res);
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Missing field');
        });
    });

    it('Should reject users with missing password', function () {
      const testUser = { username };
      return chai.request(app).post('/api/users').send(testUser)
        .catch(err => err.response)
        .then(res => {
          //console.log('BODY', res);
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Missing field');
        });
    });

    it('Should reject users with password less than 10 characters', function () {
      const testUser = { username, password: 'pass' };
      return chai.request(app).post('/api/users').send(testUser)
        .catch(err => err.response)
        .then(res => {
          // console.log('BODY', res.body.message);
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Must be at least 10 characters long');

        });
    });

    it('Should reject users with password greater than 72 characters', function () {
      const testUser = { username, password: 'passwordistoodamnlongpasswordistoodamnlongpasswordistoodamnlongpasswordistoodamnlongpasswordistoodamnlong' };
      return chai.request(app).post('/api/users').send(testUser)
        .catch(err => err.response)
        .then(res => {
          // console.log('BODY', res.body.message);
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Must be at most 72 characters long');

        });
    });

    it('Should reject users with duplicate username', function () {
      // Create an initial user
      return User.create({
        username: 'testname',
        password
      })
        .then(() =>
          // Try to create a second user with the same username
          chai.request(app).post('/api/users').send({
            username: 'testname',
            password
          })
        )
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal(
            'Username already taken'
          );
        });
    });
  });

    describe('GET', function () {
      it('Should return an empty array initially', function () {
        return chai.request(app).get('/api/users')
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
      });
      it('Should return an array of users', function () {
        const testUser0 = {
          username: `${username}`,
          password: `${password}`,
          firstName: `${firstName}`,
          lastName: `${lastName}`
        };
        const testUser1 = {
          username: `${username}1`,
          password: `${password}1`,
          firstName: `${firstName}1`,
          lastName: `${lastName}1`
        };
        const testUser2 = {
          username: `${username}2`,
          password: `${password}2`,
          firstName: `${firstName}2`,
          lastName: `${lastName}2`
        };
      });
      // it('Should return a single user', function () {
      //   let userId = '5b48cf0ee46f31368e8b069d'
      //   return chai.request(app).get(`/api/users/${userId}`)
      //     .then(res => {
      //       expect(res).to.have.status(200)
      //     })
      // });
    });

});
