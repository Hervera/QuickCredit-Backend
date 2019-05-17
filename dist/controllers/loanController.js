'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Loan = require('../models/Loan');

var _Loan2 = _interopRequireDefault(_Loan);

var _mock = require('../data/mock');

var _mock2 = _interopRequireDefault(_mock);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loans = {
  retrieveLoans: function retrieveLoans(req, res) {
    // Get all current loans that are not fully repaid.
    var reqStatus = req.query.status;
    var reqRepaid = req.query.repaid;
    var reqLoans = _mock2.default.loans.filter(function (result) {
      return result.status === reqStatus && result.repaid === reqRepaid;
    });

    if (reqLoans.length !== 0) {
      res.status(200).send({
        status: res.statusCode,
        data: reqLoans
      });
    } else if (reqStatus == null && reqRepaid == null && _mock2.default.loans !== 0) {
      res.status(200).send({
        status: res.statusCode,
        data: _mock2.default.loans
      });
    } else {
      res.status(404).send({
        status: res.statusCode,
        error: 'No loan found'
      });
    }
  },


  // Get specific loan details
  getSpecificLoan: function getSpecificLoan(req, res) {
    var id = parseInt(req.params.id, 10);

    var _Joi$validate = _joi2.default.validate({
      id: id
    }, _validation2.default.idParams),
        error = _Joi$validate.error;

    if (error) {
      return res.status(400).send({
        status: res.statusCode,
        error: error.details[0].message
      });
    }

    var loan = _mock2.default.loans.find(function (el) {
      return el.id === id;
    });
    if (loan) {
      return res.status(200).json({
        status: 200,
        data: loan
      });
    }
    return res.status(404).send({
      status: 404,
      error: 'Loan is not found'
    });
  },
  createLoan: function createLoan(req, res) {
    var _req$body = req.body,
        user = _req$body.user,
        tenor = _req$body.tenor,
        amount = _req$body.amount;


    var result = _joi2.default.validate(req.body, _validation2.default.loanSchema, { abortEarly: false });

    if (result.error) {
      var errors = [];
      for (var index = 0; index < result.error.details.length; index++) {
        errors.push(result.error.details[index].message.split('"').join(''));
      }
      return res.status(400).send({
        status: res.statusCode,
        error: errors
      });
    }

    var id = _mock2.default.loans.length + 1;
    var status = 'pending';
    var repaid = 'false';
    var interest = amount * 0.05;
    var paymentInstallment = (amount + interest) / tenor;
    var balance = 0;
    var createdOn = (0, _moment2.default)().format('MMMM Do YYYY, h:mm:ss a');
    var loan = new _Loan2.default(id, user, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest);

    var checkUser = _mock2.default.users.find(function (verifyUser) {
      return verifyUser.email === user;
    });
    if (!checkUser) {
      return res.status(404).send({
        status: 404,
        error: 'The user with that email is not registered'
      });
    }
    return res.status(201).send({
      status: res.statusCode,
      data: {
        id: loan.id,
        user: loan.user,
        createdOn: loan.createdOn,
        repaid: loan.repaid,
        tenor: loan.tenor,
        amount: loan.amount,
        paymentInstallment: loan.paymentInstallment,
        balance: loan.balance,
        interest: loan.interest
      }
    });
  },
  approveOrRejectLoan: function approveOrRejectLoan(req, res) {
    var id = parseInt(req.params.id, 10);

    var _Joi$validate2 = _joi2.default.validate({
      id: id
    }, _validation2.default.idParams),
        error = _Joi$validate2.error;

    if (error) {
      return res.status(400).send({
        status: res.statusCode,
        error: error.details[0].message // error.details to view more about the error
      });
    }

    var loan = _mock2.default.loans.find(function (el) {
      return el.id === id;
    });
    if (loan) {
      loan.status = req.body.status;
      return res.status(200).send({
        status: 200,
        data: loan
      });
    }
    return res.status(404).send({
      status: 404,
      error: 'Loan is not found'
    });
  }
};

exports.default = loans;