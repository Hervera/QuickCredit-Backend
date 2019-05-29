'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _dummy = require('./dummy');

var _dummy2 = _interopRequireDefault(_dummy);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

_dotenv2.default.config();

describe('Loan Endpoints', function () {
  var authToken = void 0;
  before(function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signin').send(_dummy2.default.authUser).end(function (err, res) {
      authToken = res.body.data.token; // save the token
      done();
    });
  });

  it('Should create a loan', function (done) {
    var loan = {
      useremail: 'admin@gmail.com',
      tenor: 6,
      amount: 4000
    };
    _chai2.default.request(_app2.default).post('/api/v2/loans').send(loan).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not create a loan if a useremail used is not the same as the auth user', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/loans').send(_dummy2.default.fakeLoan1).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(401);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should create a loan if email is not specified in url params', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/loans').send(_dummy2.default.fakeLoan2).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(401);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should retrieve all loans', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('array');
      done();
    });
  });

  it('Should retrieve a specific loan', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans/1').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not retrieve a specific loan if a loan doesn\'t exist', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans/50000').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not retrieve a specific loan if a loanid is not specified', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans/dsss').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should approve or reject a specific loan', function (done) {
    _chai2.default.request(_app2.default).patch('/api/v2/loans/1').send(_dummy2.default.LoanStatus).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not approve or reject a specific a loan if it is not found', function (done) {
    _chai2.default.request(_app2.default).patch('/api/v2/loans/50000').send(_dummy2.default.LoanStatus).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not retrieve approve or reject a loan if the loanid is not specified', function (done) {
    _chai2.default.request(_app2.default).patch('/api/v2/loans/dsss').send(_dummy2.default.LoanStatus).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
});