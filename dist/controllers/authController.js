'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _mock = require('../data/mock');

var _mock2 = _interopRequireDefault(_mock);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var auth = {
  register: function register(req, res) {
    var _req$body = req.body,
        firstName = _req$body.firstName,
        lastName = _req$body.lastName,
        email = _req$body.email,
        password = _req$body.password,
        address = _req$body.address;


    var result = _joi2.default.validate(req.body, _validation2.default.userSchema, { abortEarly: false });

    if (result.error) {
      var errors = [];
      for (var index = 0; index < result.error.details.length; index++) {
        errors.push(result.error.details[index].message.split('"').join(''));
      }
      return res.status(400).send({
        status: res.statusCode,
        error: errors
      });
    }
    var uniqueUser = _mock2.default.users.find(function (user) {
      return user.email === email;
    });
    if (uniqueUser) {
      return res.status(409).json({
        status: res.statusCode,
        error: 'User with this email:' + JSON.stringify(email) + ' is already registered'
      });
    }
    var id = _mock2.default.users.length + 1;
    var status = 'unverified';
    var createdOn = (0, _moment2.default)().format('MMMM Do YYYY, h:mm:ss a');
    var isAdmin = 'false';
    var user = new _User2.default(id, firstName, lastName, email, password, address, status, isAdmin, createdOn);
    var hash = _bcryptjs2.default.hashSync(user.password, 10);
    user.password = hash;
    var token = _jsonwebtoken2.default.sign({ user: _mock2.default.users.push(user) }, '' + process.env.SECRET_KEY_CODE);
    return res.status(201).send({
      status: res.statusCode,
      data: {
        token: token,
        id: user.id,
        fistName: firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        status: user.status,
        isAdmin: user.isAdmin,
        CreatedOn: user.createdOn
      }
    });
  },
  login: function login(req, res) {
    var _req$body2 = req.body,
        email = _req$body2.email,
        password = _req$body2.password;

    var _Joi$validate = _joi2.default.validate(req.body, _validation2.default.loginSchema),
        error = _Joi$validate.error;

    if (error) {
      var errors = [];
      for (var index = 0; index < error.details.length; index++) {
        errors.push(error.details[index].message.split('"').join(''));
      }
      return res.status(400).send({
        status: res.statusCode,
        error: errors
      });
    }
    for (var i = 0; i < _mock2.default.users.length; i++) {
      if (_mock2.default.users[i].email === email) {
        var id = _mock2.default.users[i].id;
        var firstName = _mock2.default.users[i].firstName;
        var lastName = _mock2.default.users[i].lastName;
        var status = _mock2.default.users[i].status;
        var isAdmin = _mock2.default.users[i].isAdmin;
        var createdOn = _mock2.default.users[i].createdOn;

        var truePass = _bcryptjs2.default.compareSync(password, _mock2.default.users[i].password);
        if (truePass) {
          var token = _jsonwebtoken2.default.sign({ user: _mock2.default.users[i].password }, '' + process.env.SECRET_KEY_CODE, { expiresIn: '1h' });
          return res.status(200).send({
            status: res.statusCode,
            data: {
              token: token, id: id, firstName: firstName, lastName: lastName, email: email, status: status, isAdmin: isAdmin, createdOn: createdOn
            }
          });
        }
        return res.status(400).send({
          status: res.statusCode,
          error: 'incorrect password'
        });
      }
    }
    return res.status(400).send({ status: 400, error: 'invalid email' });
  }
};

exports.default = auth;