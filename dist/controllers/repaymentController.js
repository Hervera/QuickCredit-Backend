"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _moment = _interopRequireDefault(require("moment"));

var _Repayment = _interopRequireDefault(require("../models/Repayment"));

var _mock = _interopRequireDefault(require("../data/mock"));

var _validation = _interopRequireDefault(require("../helpers/validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loans = {
  loanRepaymentHistory: function loanRepaymentHistory(req, res) {
    var id = parseInt(req.params.id, 10);

    var repaymentHistory = _mock["default"].repayments.filter(function (result) {
      return result.loanId === id;
    });

    var _Joi$validate = _joi["default"].validate({
      id: id
    }, _validation["default"].idParams),
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

    var checkLoanId = _mock["default"].loans.filter(function (result) {
      return result.id === loanId && result.status === 'approved';
    });

    var repaidTrue = _mock["default"].loans.filter(function (result) {
      return result.id === loanId && result.repaid === 'true';
    });

    var _Joi$validate2 = _joi["default"].validate({
      loanId: loanId
    }, _validation["default"].loanIdParams),
        error = _Joi$validate2.error;

    if (error) {
      res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message
      });
    } else if (repaidTrue.length !== 0) {
      res.status(400).json({
        status: res.statusCode,
        error: 'The loan has been fully repaid'
      });
    } else if (checkLoanId.length === 0) {
      res.status(404).json({
        status: res.statusCode,
        error: 'The loan doesn\'t exist'
      });
    } // Validate the inputs in body


    var paidAmount = req.body.paidAmount;

    var result = _joi["default"].validate(req.body, _validation["default"].repaymentSchema, {
      abortEarly: false
    });

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

    var id = _mock["default"].repayments.length + 1;
    var createdOn = (0, _moment["default"])().format('MMMM Do YYYY, h:mm:ss a');
    var monthlyInstallment = 4; // bring back paymentInstallment of that specific loan; (work on this later)

    var amount = 600000; // bring back loan amount of that specific loan; (work on this later)

    var interest = 0.20; // bring back interest of that specific loan; (work on this later)

    var balance = 50000; //  balance = paidAmount + lastBalance; (work on this later)

    var remain = 40000; // remain = amount - balance; (work on this later)

    var repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)

    var repayment = new _Repayment["default"](id, loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn, amount, interest);
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
var _default = loans;
exports["default"] = _default;