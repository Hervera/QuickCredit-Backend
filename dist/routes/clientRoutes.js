'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _VerifyAuthToken = require('../middleware/VerifyAuthToken');

var _VerifyAuthToken2 = _interopRequireDefault(_VerifyAuthToken);

var _loanController = require('../controllers/loanController');

var _loanController2 = _interopRequireDefault(_loanController);

var _repaymentController = require('../controllers/repaymentController');

var _repaymentController2 = _interopRequireDefault(_repaymentController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/loans', _VerifyAuthToken2.default.verifyToken, _VerifyAuthToken2.default.verifyClient, _loanController2.default.createLoan);
router.get('/loans/:id/repayments', _VerifyAuthToken2.default.verifyToken, _repaymentController2.default.loanRepaymentHistory);

exports.default = router;