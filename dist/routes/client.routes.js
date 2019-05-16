'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../middleware/auth.middleware');

var _auth2 = _interopRequireDefault(_auth);

var _loanController = require('../controllers/loanController');

var _loanController2 = _interopRequireDefault(_loanController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/loans', _auth2.default.verifyToken, _loanController2.default.createLoan);

exports.default = router;