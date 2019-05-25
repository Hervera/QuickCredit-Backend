'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _VerifyAuthToken = require('../Middleware/VerifyAuthToken');

var _VerifyAuthToken2 = _interopRequireDefault(_VerifyAuthToken);

var _LoanController = require('../Controllers/LoanController');

var _LoanController2 = _interopRequireDefault(_LoanController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/loans', _VerifyAuthToken2.default.verifyToken, _LoanController2.default.createLoan);

exports.default = router;