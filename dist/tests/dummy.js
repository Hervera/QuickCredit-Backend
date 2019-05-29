'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var user1 = {
  firstname: 'Admin',
  lastname: 'QuickCredit',
  email: 'admin@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo'
};

var user2 = {
  firstname: 'client',
  lastname: 'quickCredit',
  email: 'client2@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo'
};

var user3 = {
  firstname: '445',
  lastname: '',
  email: 'admin12@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo'
};

var authUser = {
  email: 'admin@gmail.com',
  password: 'secret'
};

var falseUserEmail = {
  email: 'xxxxxxx@gmail.com',
  password: 'secret'
};

var falseUserPassword = {
  email: 'client@gmail.com',
  password: 'xxxxxxxx'
};

var newLoan = {
  useremail: 'kevin5@gmail.com',
  tenor: 4,
  amount: 550000
};

var fakeLoan1 = {
  useremail: 'xxxxxxxx@gmail.com',
  tenor: 4,
  amount: 550000
};

var fakeLoan2 = {
  useremail: 'xxxxxxxx',
  tenor: 4,
  amount: 550000
};

var LoanStatus = {
  status: 'approved'
};

var paidamount = {
  paidamount: 5000000
};

exports.default = {
  user1: user1, user2: user2, user3: user3, authUser: authUser, falseUserEmail: falseUserEmail, falseUserPassword: falseUserPassword, newLoan: newLoan, fakeLoan1: fakeLoan1, fakeLoan2: fakeLoan2, LoanStatus: LoanStatus, paidamount: paidamount
};