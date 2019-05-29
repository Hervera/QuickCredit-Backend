'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _VerifyAuthToken = require('../middleware/VerifyAuthToken');

var _VerifyAuthToken2 = _interopRequireDefault(_VerifyAuthToken);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

var _loanController = require('../controllers/loanController');

var _loanController2 = _interopRequireDefault(_loanController);

var _repaymentController = require('../controllers/repaymentController');

var _repaymentController2 = _interopRequireDefault(_repaymentController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/users', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _userController2.default.getAllUsers);
router.get('/users/:id', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _userController2.default.getSpecificUser);
router.patch('/users/:email/verify', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _userController2.default.verifyUser);
router.get('/loans', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _loanController2.default.retrieveLoans);
router.get('/loans/:id', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _loanController2.default.getSpecificLoan);
router.patch('/loans/:id', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _loanController2.default.approveOrRejectLoan);
router.post('/loans/:id/repayment', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyAdmin, _repaymentController2.default.createLoanRepayment);

exports.default = router;