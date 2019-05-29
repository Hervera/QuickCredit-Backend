'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _dummy = require('./dummy');

var _dummy2 = _interopRequireDefault(_dummy);

var _connection = require('../data/connection');

var _connection2 = _interopRequireDefault(_connection);

var _queries = require('../data/queries');

var _queries2 = _interopRequireDefault(_queries);

var _tables = require('../data/tables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

beforeEach(async function () {
  await (0, _tables.dropTables)();
  await (0, _tables.createTables)();

  // Create a user before testing other user related tests
  var user = {
    firstname: 'client',
    lastname: 'client',
    email: 'client@gmail.com',
    password: 'secret',
    address: 'Kigali',
    status: 'verified',
    isadmin: 'true',
    createdon: new Date(),
    updatedon: new Date()
  };
  _jsonwebtoken2.default.sign(user, '' + process.env.SECRET_KEY_CODE, { expiresIn: '24h' });
  await _connection2.default.query(_queries2.default.insertUser, [user.firstname, user.lastname, user.email, user.password, user.address, user.status, user.isadmin, user.createdon, user.updatedon]);

  // Create a loan of the registered user before testing other loans
  var createdon = new Date();
  var amount = 50000; // bring back loan amount of that specific loan; (work on this later)
  var interest = amount * 0.5;
  var tenor = 4;
  var balance = 0;
  var paymentinstallment = (amount + interest) / tenor; // bring back paymentinstallment of that specific loan; (work on this later)
  var remain = amount - balance; // remain = amount - balance; (work on this later)
  var repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
  var approvedLoan = {
    useremail: 'client@gmail.com',
    tenor: 4,
    amount: amount,
    status: 'approved',
    repaid: repaid,
    interest: 60000,
    paymentinstallment: paymentinstallment,
    balance: balance,
    createdon: createdon,
    updatedon: new Date()
  };
  var notApprovedLoan = {
    useremail: 'client@gmail.com',
    tenor: 4,
    amount: amount,
    status: 'pending',
    repaid: repaid,
    interest: 60000,
    paymentinstallment: paymentinstallment,
    balance: balance,
    createdon: createdon,
    updatedon: new Date()
  };
  var approvedLoanvalues = [approvedLoan.useremail, approvedLoan.createdon, approvedLoan.status, approvedLoan.repaid, approvedLoan.tenor, approvedLoan.amount, approvedLoan.paymentinstallment, approvedLoan.balance, approvedLoan.interest, approvedLoan.updatedon];
  var notApprovedLoanvalues = [notApprovedLoan.useremail, notApprovedLoan.createdon, notApprovedLoan.status, notApprovedLoan.repaid, notApprovedLoan.tenor, notApprovedLoan.amount, notApprovedLoan.paymentinstallment, notApprovedLoan.balance, notApprovedLoan.interest, notApprovedLoan.updatedon];
  await _connection2.default.query(_queries2.default.insertLoan, approvedLoanvalues);
  await _connection2.default.query(_queries2.default.insertLoan, notApprovedLoanvalues);

  // Create a repayment of the registered loan before testing other repayment
  var paidamount = 5000;
  var repayment = {
    loanid: 1,
    monthlyInstallment: paymentinstallment,
    paidamount: paidamount,
    repaid: repaid,
    balance: paidamount,
    remain: remain,
    createdon: new Date()
  };
  var repayValues = [repayment.loanid, repayment.monthlyInstallment, repayment.paidamount, repayment.repaid, repayment.balance, repayment.remain, repayment.createdon];
  await _connection2.default.query(_queries2.default.insertRepayment, repayValues);
});
// after(async () => {
//   await dropTables();
// });

describe('User authentication Endpoints', function () {
  it('Should create an account', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signup').send(_dummy2.default.user2).set('Accept', 'Application/JSON').end(function (err, res) {
      // console.log(res.body);
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('Object');
      done();
    });
  });

  it('Should not create an account if user email already exists', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signup').send(_dummy2.default.user1).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(409);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not create an account if input are not validated', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signup').send(_dummy2.default.user3).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should be able to login', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signin').send(_dummy2.default.authUser).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('Object');
      done();
    });
  });

  it('Should not login a user if email is incorrect', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signin').send(_dummy2.default.falseUserEmail).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });

  it('Should not login a user if password is incorrect', function (done) {
    _chai2.default.request(_app2.default).post('/api/v2/auth/signin').send(_dummy2.default.falseUserPassword).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
});