'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _mock = require('../data/mock');

var _mock2 = _interopRequireDefault(_mock);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = {

  // Get all users
  getAllUsers: function getAllUsers(req, res) {
    if (_mock2.default.users.length === 0) {
      res.status(404).json({
        status: 404,
        error: 'No user found'
      });
    } else {
      // const valueToShow = mock.users.forEach((item) => {
      //   item.password;
      // });
      res.status(200).json({
        status: 200,
        successMessage: 'Users',
        data: _mock2.default.users
      });
    }
  },


  // Get a specific user details
  getSpecificUser: function getSpecificUser(req, res) {
    var id = parseInt(req.params.id, 10);

    var _Joi$validate = _joi2.default.validate({
      id: id
    }, _validation2.default.idParams),
        error = _Joi$validate.error;

    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message // error.details to view more about the error
      });
    }
    var user = _mock2.default.users.find(function (el) {
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

    var _Joi$validate2 = _joi2.default.validate({
      email: email
    }, _validation2.default.emailParams),
        error = _Joi$validate2.error;

    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message // error.details to view more about the error
      });
    }
    var user = _mock2.default.users.find(function (el) {
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

exports.default = users;