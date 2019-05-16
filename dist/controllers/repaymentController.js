'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Repayment = require('../models/Repayment');

var _Repayment2 = _interopRequireDefault(_Repayment);

var _mock = require('../data/mock');

var _mock2 = _interopRequireDefault(_mock);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var repayments = {
  loanRepaymentHistory: function loanRepaymentHistory(req, res) {
    var id = Number(req.params.id);
    var repaymentHistory = _mock2.default.repayments.filter(function (result) {
      return result.loanId === id;
    });

    var _Joi$validate = _joi2.default.validate({
      id: id
    }, _validation2.default.idParams),
        error = _Joi$validate.error;

    if (error) {
      res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message
      });
    } else if (repaymentHistory.length !== 0) {
      res.status(200).json({
        status: res.statusCode,
        data: repaymentHistory
      });
    } else {
      res.status(404).json({
        status: res.statusCode,
        error: 'There is no repayment history for that loan'
      });
    }
  },
  createLoanRepayment: function createLoanRepayment(req, res) {
    var loanId = parseInt(req.params.id, 10);
    var checkLoanId = _mock2.default.loans.find(function (result) {
      return result.id === loanId && result.status === 'approved';
    });
    var repaidTrue = _mock2.default.loans.find(function (result) {
      return result.id === loanId && result.repaid === 'true';
    });
    var paidAmount = req.body.paidAmount;

    var _Joi$validate2 = _joi2.default.validate({ loanId: loanId }, _validation2.default.loanIdParams),
        error = _Joi$validate2.error;

    var result = _joi2.default.validate(req.body, _validation2.default.repaymentSchema, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message
      });
    }
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
    if (repaidTrue) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The loan has been fully repaid'
      });
    }
    if (!checkLoanId) {
      return res.status(404).json({
        status: res.statusCode,
        error: 'The loan doesn\'t exist'
      });
    }

    var id = _mock2.default.repayments.length + 1;
    var createdOn = (0, _moment2.default)().format('MMMM Do YYYY, h:mm:ss a');
    var monthlyInstallment = 4; // bring back paymentInstallment of that specific loan; (work on this later)
    var amount = 600000; // bring back loan amount of that specific loan; (work on this later)
    var interest = 0.20; // bring back interest of that specific loan; (work on this later)
    var balance = 50000; //  balance = paidAmount + lastBalance; (work on this later)
    var remain = 40000; // remain = amount - balance; (work on this later)
    var repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
    var repayment = new _Repayment2.default(id, loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn, amount, interest);
    return res.status(201).send({
      status: res.statusCode,
      data: {
        id: repayment.id,
        loanId: repayment.loanId,
        monthlyInstallment: repayment.monthlyInstallment,
        paidAmount: repayment.paidAmount,
        amount: repayment.amount,
        interest: repayment.interest,
        repaid: repayment.repaid,
        balance: repayment.balance,
        remain: repayment.remain,
        CreatedOn: repayment.createdOn
      }
    });
  }
};

exports.default = repayments;