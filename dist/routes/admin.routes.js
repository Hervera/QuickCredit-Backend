'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _VerifyAuthToken = require('../Middleware/VerifyAuthToken');

var _VerifyAuthToken2 = _interopRequireDefault(_VerifyAuthToken);

var _UserController = require('../Controllers/UserController');

var _UserController2 = _interopRequireDefault(_UserController);

var _LoanController = require('../Controllers/LoanController');

var _LoanController2 = _interopRequireDefault(_LoanController);

var _RepaymentController = require('../Controllers/RepaymentController');

var _RepaymentController2 = _interopRequireDefault(_RepaymentController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/users', _VerifyAuthToken2.default.verifyToken, _UserController2.default.getAllUsers);
router.get('/users/:id', _VerifyAuthToken2.default.verifyToken, _UserController2.default.getSpecificUser);
router.patch('/users/:email/verify', _VerifyAuthToken2.default.verifyToken, _UserController2.default.verifyUser);
router.get('/loans', _VerifyAuthToken2.default.verifyToken, _LoanController2.default.retrieveLoans);
router.get('/loans/:id', _VerifyAuthToken2.default.verifyToken, _LoanController2.default.getSpecificLoan);
router.patch('/loans/:id', _VerifyAuthToken2.default.verifyToken, _LoanController2.default.approveOrRejectLoan);
router.get('/loans/:id/repayments', _VerifyAuthToken2.default.verifyToken, _RepaymentController2.default.loanRepaymentHistory);
router.post('/loans/:id/repayment', _VerifyAuthToken2.default.verifyToken, _RepaymentController2.default.createLoanRepayment);

exports.default = router;