"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repayment = function Repayment(id, loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn) {
  _classCallCheck(this, Repayment);

  this.id = id;
  this.loanId = loanId;
  this.monthlyInstallment = monthlyInstallment;
  this.paidAmount = paidAmount;
  this.repaid = repaid;
  this.balance = balance;
  this.remain = remain;
  this.createdOn = createdOn;
};

exports.default = Repayment;