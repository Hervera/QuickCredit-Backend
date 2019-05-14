"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _mock = _interopRequireDefault(require("../data/mock"));

var _validation = _interopRequireDefault(require("../helpers/validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var users = {
  // Get all users
  getAllUsers: function getAllUsers(req, res) {
    if (_mock["default"].users.length === 0) {
      res.status(404).json({
        status: 404,
        error: 'No user found'
      });
    } else {
      res.status(200).json({
        status: 200,
        successMessage: 'Users',
        data: _mock["default"].users
      });
    }
  },
  // Get specific user details
  getSpecificUser: function getSpecificUser(req, res) {
    var id = parseInt(req.params.id, 10);

    var _Joi$validate = _joi["default"].validate({
      id: id
    }, _validation["default"].idParams),
        error = _Joi$validate.error;

    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message // error.details to view more about the error

      });
    }

    var user = _mock["default"].users.find(function (el) {
      return el.id === id;
    });

    if (user) {
      return res.status(200).json({
        status: 200,
        data: user
      });
    }

    return res.status(404).json({
      status: 404,
      error: 'User is not found'
    });
  },
  verifyUser: function verifyUser(req, res) {
    var email = req.params.email;

    var _Joi$validate2 = _joi["default"].validate({
      email: email
    }, _validation["default"].emailParams),
        error = _Joi$validate2.error;

    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message // error.details to view more about the error

      });
    }

    var user = _mock["default"].users.find(function (el) {
      return el.email === email;
    });

    if (user) {
      user.status = 'verified';
      return res.status(200).json({
        status: 200,
        data: user
      });
    }

    return res.status(404).json({
      status: 404,
      error: 'User is not found'
    });
  }
};
var _default = users;
exports["default"] = _default;