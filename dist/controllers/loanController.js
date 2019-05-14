"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _moment = _interopRequireDefault(require("moment"));

var _Loan = _interopRequireDefault(require("../models/Loan"));

var _mock = _interopRequireDefault(require("../data/mock"));

var _validation = _interopRequireDefault(require("../helpers/validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loans = {
  retrieveLoans: function retrieveLoans(req, res) {
    // Get all current loans that are not fully repaid.
    var reqStatus = req.query.status;
    var reqRepaid = req.query.repaid;

    var reqLoans = _mock["default"].loans.filter(function (result) {
      return result.status === reqStatus && result.repaid === reqRepaid;
    });

    if (reqLoans.length !== 0) {
      res.status(200).send({
        status: res.statusCode,
        data: reqLoans
      });
    } else if (reqStatus == null && reqRepaid == null && _mock["default"].loans !== 0) {
      res.status(200).send({
        status: res.statusCode,
        data: _mock["default"].loans
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

    var _Joi$validate = _joi["default"].validate({
      id: id
    }, _validation["default"].idParams),
        error = _Joi$validate.error;

    if (error) {
      return res.status(400).send({
        status: res.statusCode,
        error: error.details[0].message
      });
    }

    var loan = _mock["default"].loans.find(function (el) {
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

    var result = _joi["default"].validate(req.body, _validation["default"].loanSchema, {
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

    var id = _mock["default"].loans.length + 1;
    var status = 'pending';
    var repaid = 'false';
    var interest = 5;
    var paymentInstallment = (amount + interest) / tenor;
    var balance = 0;
    var createdOn = (0, _moment["default"])().format('MMMM Do YYYY, h:mm:ss a');
    var loan = new _Loan["default"](id, user, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest);

    var checkUser = _mock["default"].users.filter(function (verifyUser) {
      return verifyUser.email === user;
    });

    if (checkUser.length === 0) {
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

    var _Joi$validate2 = _joi["default"].validate({
      id: id
    }, _validation["default"].idParams),
        error = _Joi$validate2.error;

    if (error) {
      return res.status(400).send({
        status: res.statusCode,
        error: error.details[0].message // error.details to view more about the error

      });
    }

    var loan = _mock["default"].loans.find(function (el) {
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
var _default = loans;
exports["default"] = _default;