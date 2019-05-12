"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userController = _interopRequireDefault(require("../controllers/userController"));

var _loanController = _interopRequireDefault(require("../controllers/loanController"));

var _repaymentController = _interopRequireDefault(require("../controllers/repaymentController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/users', _userController["default"].getAllUsers);
router.get('/users/:id', _userController["default"].getSpecificUser);
router.put('/users/:email/verify', _userController["default"].verifyUser);
router.get('/loans', _loanController["default"].retrieveLoans);
router.get('/loans/:id', _loanController["default"].getSpecificLoan);
router.put('/loans/:id', _loanController["default"].approveOrRejectLoan);
router.get('/loans/:id/repayments', _repaymentController["default"].loanRepaymentHistory);
router.post('/loans/:id/repayment', _repaymentController["default"].createLoanRepayment);
var _default = router;
exports["default"] = _default;