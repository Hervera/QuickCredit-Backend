"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loan = function Loan(id, user, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest) {
  _classCallCheck(this, Loan);

  this.id = id;
  this.user = user;
  this.createdOn = createdOn;
  this.status = status;
  this.repaid = repaid;
  this.tenor = tenor;
  this.amount = amount;
  this.paymentInstallment = paymentInstallment;
  this.balance = balance;
  this.interest = interest;
};

var _default = Loan;
exports["default"] = _default;