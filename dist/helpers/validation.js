'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = _joi2.default.object().keys({
  firstName: _joi2.default.string().alphanum().min(3).max(20).required(),
  lastName: _joi2.default.string().alphanum().min(3).max(20).required(),
  email: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
  password: _joi2.default.string().min(6).max(20).required(),
  address: _joi2.default.string().min(2).max(100).required()
});

var loginSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
  password: _joi2.default.string().min(6).max(20).required()
});

var idParams = _joi2.default.object().keys({
  id: _joi2.default.number().integer().required()
});

var emailParams = _joi2.default.object().keys({
  email: _joi2.default.string().email({ minDomainAtoms: 2 }).required()
});

var loanSchema = _joi2.default.object().keys({
  user: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
  tenor: _joi2.default.number().integer().required(),
  amount: _joi2.default.number().required()
});

var repaymentSchema = _joi2.default.object().keys({
  paidAmount: _joi2.default.number().required()
});

var loanIdParams = _joi2.default.object().keys({
  loanId: _joi2.default.number().integer().required()
});

exports.default = {
  userSchema: userSchema, loginSchema: loginSchema, idParams: idParams, emailParams: emailParams, loanSchema: loanSchema, repaymentSchema: repaymentSchema, loanIdParams: loanIdParams
};