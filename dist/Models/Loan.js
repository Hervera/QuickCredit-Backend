"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loan = function Loan(useremail, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest, updatedon) {
  _classCallCheck(this, Loan);

  this.useremail = useremail;
  this.createdon = createdon;
  this.status = status;
  this.repaid = repaid;
  this.tenor = tenor;
  this.amount = amount;
  this.paymentinstallment = paymentinstallment;
  this.balance = balance;
  this.interest = interest;
  this.updatedon = updatedon;
};

exports.default = Loan;