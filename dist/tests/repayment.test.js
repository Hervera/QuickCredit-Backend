"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-undef */
_chai["default"].should();

_chai["default"].use(_chaiHttp["default"]);

describe('Repayment Endpoints', function () {
  it('Should retrieve repayment history', function (done) {
    _chai["default"].request(_app["default"]).get('/api/loans/2/repayments').set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('array');
      done();
    });
  });
  it('Should Create a loan repayment record.', function (done) {
    var loan = {
      paidAmount: 5000000
    };

    _chai["default"].request(_app["default"]).post('/api/loans/5/repayment').send(loan).set('Accept', 'Application/JSON').end(function (err, res) {
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

    _chai["default"].request(_app["default"]).post('/api/loans/1/repayment').send(loan).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });
});