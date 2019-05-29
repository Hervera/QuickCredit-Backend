'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _dummy = require('./dummy');

var _dummy2 = _interopRequireDefault(_dummy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

_dotenv2.default.config();

describe('Repayment Endpoints', function () {
  var authToken = void 0;
  before(function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signin').send(_dummy2.default.authUser).end(function (err, res) {
      authToken = res.body.data.token; // save the token
      done();
    });
  });

  it('Should retrieve repayment history if a loan exists', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans/1/repayments').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('array');
      done();
    });
  });

  it('Should not retrieve repayment history if a loan doesn\'t exist', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans/500000/repayments').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not retrieve repayment history if a loanid is not specified', function (done) {
    _chai2.default.request(_app2.default).get('/api/v2/loans/dsss/repayments').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should create a loan repayment record.', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/loans/1/repayment').send(_dummy2.default.paidamount).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not create a loan repayment record if a loan doesn\'t exist.', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/loans/1000000000/repayment').send(_dummy2.default.paidamount).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not create a loan repayment record if a loan is not approved', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/loans/2/repayment').send(_dummy2.default.paidamount).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not create a loan repayment record if a loan is not specified', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/loans/xxxxx/repayment').send(_dummy2.default.paidamount).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
});