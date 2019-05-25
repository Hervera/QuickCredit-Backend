'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _Loan = require('../models/Loan');

var _Loan2 = _interopRequireDefault(_Loan);

var _connection = require('../data/connection');

var _connection2 = _interopRequireDefault(_connection);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

var _queries = require('../data/queries');

var _queries2 = _interopRequireDefault(_queries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoanController = function () {
  function LoanController() {
    _classCallCheck(this, LoanController);
  }

  _createClass(LoanController, null, [{
    key: 'retrieveLoans',
    value: async function retrieveLoans(req, res) {
      try {
        // Get all current loans
        var _ref = await _connection2.default.query(_queries2.default.retrieveAllLoans),
            rows = _ref.rows,
            rowCount = _ref.rowCount;

        var reqStatus = req.query.status;
        var reqRepaid = req.query.repaid;

        // Get all loans which safisfies the requested status and the requested repaid
        var reqLoans = await _connection2.default.query(_queries2.default.repaidLoans, [reqStatus, reqRepaid]);
        if (reqLoans.rows.length !== 0) {
          return res.status(200).json({
            status: res.statusCode,
            data: reqLoans.rows
          });
        }
        if (reqStatus == null && reqRepaid == null && rows.length !== 0) {
          return res.status(200).json({
            status: res.statusCode,
            total: rowCount,
            data: rows
          });
        }
        return res.status(404).json({
          status: res.statusCode,
          error: 'No loan found'
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + error
        });
      }
    }

    // Get specific loan details

  }, {
    key: 'getSpecificLoan',
    value: async function getSpecificLoan(req, res) {
      try {
        var id = req.params.id;

        var _Joi$validate = _joi2.default.validate({
          id: id
        }, _validation2.default.idParams),
            error = _Joi$validate.error;

        if (error) {
          return res.status(400).json({
            status: res.statusCode,
            error: error.details[0].message
          });
        }

        var _ref2 = await _connection2.default.query(_queries2.default.getLoan, [req.params.id]),
            rows = _ref2.rows;

        if (!rows[0]) {
          return res.status(404).json({
            status: res.statusCode,
            error: 'Loan is not found'
          });
        }
        return res.status(200).json({
          status: 200,
          data: {
            id: 2,
            user: rows[0].useremail,
            createdon: rows[0].createdon,
            status: rows[0].status,
            repaid: rows[0].repaid,
            tenor: rows[0].tenor,
            amount: rows[0].amount,
            paymentinstallment: rows[0].paymentinstallment,
            balance: rows[0].balance,
            interest: rows[0].interest,
            updatedon: rows[0].updatedon
          }
        });
      } catch (er) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + er
        });
      }
    }
  }, {
    key: 'createLoan',
    value: async function createLoan(req, res) {
      try {
        var _req$body = req.body,
            useremail = _req$body.useremail,
            tenor = _req$body.tenor,
            amount = _req$body.amount;

        var _Joi$validate2 = _joi2.default.validate(req.body, _validation2.default.loanSchema),
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

        var status = 'pending';
        var repaid = 'false';
        var interest = amount * 0.05;
        var paymentinstallment = (amount + interest) / tenor;
        var balance = 0;
        var createdon = new Date();
        var updatedon = new Date();
        var loan = new _Loan2.default(useremail, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest, updatedon);

        var _ref3 = await _connection2.default.query(_queries2.default.getUserByEmail, [useremail]),
            rows = _ref3.rows;

        if (!rows[0]) {
          return res.status(404).json({ status: res.statusCode, error: 'That user is not registered' });
        }
        if (rows.length !== 0 && rows[0].status !== 'verified') {
          return res.status(404).json({ status: res.statusCode, error: 'User with this email: "' + useremail + '" is not yet verified' });
        }
        var userWithLoan = await _connection2.default.query(_queries2.default.fetchUserInLoan, [useremail]);
        if (userWithLoan.rows.length !== 0) {
          if (userWithLoan.rows[0].status === 'pending') {
            return res.status(404).json({ status: res.statusCode, error: 'You still have a loan pending' });
          }
          if (userWithLoan.rows[0].repaid === false) {
            return res.status(404).json({ status: res.statusCode, error: 'You still have an unrepaid loan' });
          }
        }
        var nameFirst = rows[0].firstname;
        var nameLast = rows[0].lastname;
        var values = [loan.useremail, loan.createdon, loan.status, loan.repaid, loan.tenor, loan.amount, loan.paymentinstallment, loan.balance, loan.interest, loan.updatedon];
        var newLoan = await _connection2.default.query(_queries2.default.insertLoan, values);
        return res.status(201).json({
          status: res.statusCode,
          data: {
            loanid: newLoan.rows[0].id,
            firstname: nameFirst,
            lastname: nameLast,
            email: newLoan.rows[0].useremail,
            tenor: newLoan.rows[0].tenor,
            amount: newLoan.rows[0].amount,
            paymentinstallment: newLoan.rows[0].paymentinstallment,
            status: newLoan.rows[0].status,
            balance: newLoan.rows[0].balance,
            interest: newLoan.rows[0].interest
          }
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + error
        });
      }
    }
  }, {
    key: 'approveOrRejectLoan',
    value: async function approveOrRejectLoan(req, res) {
      try {
        var id = parseInt(req.params.id, 10);
        var status = req.body.status;

        var _Joi$validate3 = _joi2.default.validate({ id: id, status: status }, _validation2.default.loanStatusSchema, { abortEarly: false }),
            error = _Joi$validate3.error;

        if (error != null) {
          var errors = [];
          for (var index = 0; index < error.details.length; index++) {
            errors.push(error.details[index].message.split('"').join(''));
          }
          return res.status(400).json({
            status: res.statusCode,
            error: errors
          });
        }
        var findLoan = await _connection2.default.query(_queries2.default.getLoan, [req.params.id]);
        if (findLoan.rows.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'Loan is not found'
          });
        }
        var updateDate = new Date();
        var updatedLoan = await _connection2.default.query(_queries2.default.approveOrRejectLoan, [req.body.status, updateDate, findLoan.rows[0].id]);
        return res.status(200).json({
          status: 200,
          data: {
            LoanId: 2,
            LoanAmount: updatedLoan.rows[0].amount,
            tenor: updatedLoan.rows[0].tenor,
            status: updatedLoan.rows[0].status,
            monthlyInstallment: updatedLoan.rows[0].paymentinstallment,
            interest: updatedLoan.rows[0].interest,
            user: updatedLoan.rows[0].useremail,
            repaid: updatedLoan.rows[0].repaid,
            balance: updatedLoan.rows[0].balance,
            createdon: updatedLoan.rows[0].createdon,
            updatedon: updatedLoan.rows[0].updatedon
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

  return LoanController;
}();

exports.default = LoanController;