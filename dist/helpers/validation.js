'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = _joi2.default.object().keys({
  firstname: _joi2.default.string().alphanum().min(3).max(20).required(),
  lastname: _joi2.default.string().alphanum().min(3).max(20).required(),
  email: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
  password: _joi2.default.string().min(6).max(20).required(),
  address: _joi2.default.string().min(2).max(100).required(),
  isadmin: _joi2.default.boolean().allow(null),
  status: _joi2.default.allow(null),
  createdon: _joi2.default.allow(null),
  updatedon: _joi2.default.allow(null)
});

var loginSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
  password: _joi2.default.string().min(6).max(20).required()
});

var idParams = _joi2.default.object().keys({
  id: _joi2.default.number().integer().positive().required()
});

var emailParams = _joi2.default.object().keys({
  email: _joi2.default.string().email({ minDomainAtoms: 2 }).required()
});

var loanSchema = _joi2.default.object().keys({
  useremail: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
  tenor: _joi2.default.number().positive().integer().min(1).max(12).required(),
  amount: _joi2.default.number().positive().required()
});

var repaymentSchema = _joi2.default.object().keys({
  loanid: _joi2.default.number().positive().integer().required(),
  paidamount: _joi2.default.number().positive().required()
});

var loanidParams = _joi2.default.object().keys({
  loanid: _joi2.default.number().integer().positive().required()
});

var loanStatusSchema = _joi2.default.object().keys({
  id: _joi2.default.number().integer().positive().required(),
  status: _joi2.default.string().valid('approved', 'rejected').required()
});

exports.default = {
  userSchema: userSchema, loginSchema: loginSchema, idParams: idParams, emailParams: emailParams, loanSchema: loanSchema, repaymentSchema: repaymentSchema, loanidParams: loanidParams, loanStatusSchema: loanStatusSchema
};