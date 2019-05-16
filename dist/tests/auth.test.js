'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _dummy = require('./dummy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

describe('User authentication Endpoints', function () {
  it('Should not create an account if input are not validated', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signup').send(_dummy.user1).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not create an account if user email already exists', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signup').send(_dummy.registeredUser).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(409);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should create an account', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signup').send(_dummy.newUser).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('Object');
      done();
    });
  });

  it('Should be able to login', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send(_dummy.authUser).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('Object');
      done();
    });
  });

  it('Should not login a user if email is incorrect', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send(_dummy.falseUserEmail).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not login a user if password is incorrect', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send(_dummy.falseUserPassword).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
});