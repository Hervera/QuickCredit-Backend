'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should(); /* eslint-disable no-undef */

_chai2.default.use(_chaiHttp2.default);

describe('User Endpoints', function () {
  var authToken = void 0;
  before(function (done) {
    var user = {
      email: 'hervera@gmail.com',
      password: 'secret'
    };

    _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send(user).end(function (err, res) {
      authToken = res.body.data[0].token; // save the token
      done();
    });
  });

  it('Should retrieve all users', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/users').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('array');
      done();
    });
  });

  it('Should retrieve a specific user/client', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/users/1').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not retrieve a specific user/client if user is not found', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/users/0').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not retrieve a specific user/client if the userId is not specified', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/users/dsss').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should verify a user if email of the user is found', function (done) {
    _chai2.default.request(_app2.default).put('/api/v1/users/hervera@gmail.com/verify').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not verify a user if email is not found', function (done) {
    _chai2.default.request(_app2.default).put('/api/v1/users/xxxxx@gmail.com/verify').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not verify a user if email is not specified', function (done) {
    _chai2.default.request(_app2.default).put('/api/v1/users/xxxxx/verify').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
});