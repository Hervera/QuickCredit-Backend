"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userSchema = _joi["default"].object().keys({
  firstName: _joi["default"].string().alphanum().min(3).max(20).required(),
  lastName: _joi["default"].string().alphanum().min(3).max(20).required(),
  email: _joi["default"].string().email({
    minDomainAtoms: 2
  }).required(),
  password: _joi["default"].string().min(6).max(20).required(),
  address: _joi["default"].string().min(2).max(100).required()
});

var loginSchema = _joi["default"].object().keys({
  email: _joi["default"].string().email({
    minDomainAtoms: 2
  }).required(),
  password: _joi["default"].string().min(6).max(20).required()
});

var idParams = _joi["default"].object().keys({
  id: _joi["default"].number().integer().required()
});

var emailParams = _joi["default"].object().keys({
  email: _joi["default"].string().email({
    minDomainAtoms: 2
  }).required()
});

var loanSchema = _joi["default"].object().keys({
  user: _joi["default"].string().email({
    minDomainAtoms: 2
  }).required(),
  tenor: _joi["default"].number().integer().required(),
  amount: _joi["default"].number().required()
});

var repaymentSchema = _joi["default"].object().keys({
  paidAmount: _joi["default"].number().required()
});

var loanIdParams = _joi["default"].object().keys({
  loanId: _joi["default"].number().integer().required()
});

var _default = {
  userSchema: userSchema,
  loginSchema: loginSchema,
  idParams: idParams,
  emailParams: emailParams,
  loanSchema: loanSchema,
  repaymentSchema: repaymentSchema,
  loanIdParams: loanIdParams
};
exports["default"] = _default;