"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repayment = function Repayment(loanid, monthlyInstallment, paidamount, repaid, balance, remain, createdon) {
  _classCallCheck(this, Repayment);

  this.loanid = loanid;
  this.monthlyInstallment = monthlyInstallment;
  this.paidamount = paidamount;
  this.repaid = repaid;
  this.balance = balance;
  this.remain = remain;
  this.createdon = createdon;
};

exports.default = Repayment;