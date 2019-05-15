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

describe('Repayment Endpoints', function () {
  it('Should retrieve repayment history if a loan exists', function (done) {
    _chai2.default.request(_app2.default).get('/api/loans/2/repayments').set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('array');
      done();
    });
  });

  it('Should not retrieve repayment history if a loan doesn\'t exist', function (done) {
    _chai2.default.request(_app2.default).get('/api/loans/0/repayments').set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not retrieve repayment history if a loanId is not specified', function (done) {
    _chai2.default.request(_app2.default).get('/api/loans/dsss/repayments').set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should Create a loan repayment record.', function (done) {
    var loan = {
      paidAmount: 5000000
    };
    _chai2.default.request(_app2.default).post('/api/loans/5/repayment').send(loan).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('object');
      done();
    });
  });

  it('Should not create a loan repayment record if a loan is not approved or doen\'t exist.', function (done) {
    var loan = {
      paidAmount: 5000000
    };
    _chai2.default.request(_app2.default).post('/api/loans/1/repayment').send(loan).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });
});