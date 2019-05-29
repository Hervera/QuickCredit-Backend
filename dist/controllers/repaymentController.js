'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Repayment = require('../models/Repayment');

var _Repayment2 = _interopRequireDefault(_Repayment);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

var _connection = require('../data/connection');

var _connection2 = _interopRequireDefault(_connection);

var _queries = require('../data/queries');

var _queries2 = _interopRequireDefault(_queries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RepaymentController = function () {
  function RepaymentController() {
    _classCallCheck(this, RepaymentController);
  }

  _createClass(RepaymentController, null, [{
    key: 'loanRepaymentHistory',
    value: async function loanRepaymentHistory(req, res) {
      try {
        var loanid = Number(req.params.id);

        var _Joi$validate = _joi2.default.validate({
          loanid: loanid
        }, _validation2.default.loanidParams),
            error = _Joi$validate.error;

        if (error) {
          return res.status(400).json({
            status: res.statusCode,
            error: error.details[0].message
          });
        }
        var repaymentHistory = await _connection2.default.query(_queries2.default.repaymentHistory, [loanid]);
        if (repaymentHistory.rows.length === 0) {
          return res.status(404).json({
            status: res.statusCode,
            error: 'There is no repayment history for that loan'
          });
        }
        return res.status(200).json({
          status: res.statusCode,
          data: repaymentHistory.rows
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + error
        });
      }
    }
  }, {
    key: 'createLoanRepayment',
    value: async function createLoanRepayment(req, res) {
      try {
        var loanid = parseInt(req.params.id, 10);
        var paidamount = req.body.paidamount;

        var _Joi$validate2 = _joi2.default.validate({ loanid: loanid, paidamount: paidamount }, _validation2.default.repaymentSchema),
            error = _Joi$validate2.error;

        if (error) {
          var errors = [];
          for (var index = 0; index < error.details.length; index++) {
            errors.push(error.details[index].message.split('"').join(''));
          }
          return res.status(400).send({
            status: res.statusCode,
            error: errors
          });
        }
        var checkedLoan = await _connection2.default.query(_queries2.default.getLoan, [req.params.id]);
        if (!checkedLoan.rows[0]) {
          return res.status(404).json({
            status: res.statusCode,
            error: 'The loan doesn\'t exist'
          });
        }
        var currentStatus = checkedLoan.rows[0].status;
        var currentRepaid = checkedLoan.rows[0].repaid;
        var currentAmount = checkedLoan.rows[0].amount;
        var currentBalance = checkedLoan.rows[0].balance;
        if (currentStatus === 'approved' && currentRepaid === true) {
          return res.status(400).json({
            status: res.statusCode,
            error: 'The loan has been fully repaid'
          });
        }
        if (currentStatus === 'pending' || currentStatus === 'rejected') {
          return res.status(400).json({
            status: res.statusCode,
            error: 'The loan is not approved'
          });
        }
        var createdon = (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss');
        var monthlyInstallment = 4; // bring back paymentinstallment of that specific loan; (work on this later)
        var amount = currentAmount; // bring back loan amount of that specific loan; (work on this later)
        var interest = amount * 0.5;
        var balance = currentBalance + 50000; //  balance = paidamount + lastBalance; (work on this later)
        var remain = amount - balance; // remain = amount - balance; (work on this later)
        var repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
        var repayment = new _Repayment2.default(loanid, monthlyInstallment, paidamount, repaid, balance, remain, createdon);
        var dataValues = [repayment.loanid, repayment.monthlyInstallment, repayment.paidamount, repayment.repaid, repayment.balance, repayment.remain, repayment.createdon];
        var repaidPart = await _connection2.default.query(_queries2.default.insertRepayment, dataValues);
        return res.status(201).send({
          status: res.statusCode,
          data: {
            id: repaidPart.rows[0].id,
            loanId: repaidPart.rows[0].loanid,
            monthlyInstallment: repaidPart.rows[0].monthlyinstallment,
            paidAmount: repaidPart.rows[0].paidamount,
            amount: amount,
            interest: interest,
            repaid: repaidPart.rows[0].repaid,
            balance: repaidPart.rows[0].balance,
            remain: repaidPart.rows[0].remain,
            createdOn: repaidPart.rows[0].createdon
          }
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + error
        });
      }
    }
  }]);

  return RepaymentController;
}();

exports.default = RepaymentController;