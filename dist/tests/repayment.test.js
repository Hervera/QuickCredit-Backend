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

describe('Repayment Endpoints', function () {
  var authToken = void 0;
  before(function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send(_dummy.authUser).end(function (err, res) {
      authToken = res.body.data.token; // save the token
      done();
    });
  });
  it('Should retrieve repayment history if a loan exists', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/loans/2/repayments').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('array');
      done();
    });
  });

  it('Should not retrieve repayment history if a loan doesn\'t exist', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/loans/50000/repayments').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not retrieve repayment history if a loanId is not specified', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/loans/dsss/repayments').set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should create a loan repayment record.', function (done) {
    var loan = {
      paidAmount: 5000000
    };
    _chai2.default.request(_app2.default).post('/api/v1/loans/5/repayment').send(loan).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not create a loan repayment record if a loan is not approved or doesn\'t exist.', function (done) {
    var loan = {
      paidAmount: 5000000
    };
    _chai2.default.request(_app2.default).post('/api/v1/loans/1/repayment').send(loan).set('Accept', 'Application/JSON').set('Authorization', 'Bearer ' + authToken).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });
});