"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _moment = _interopRequireDefault(require("moment"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _User = _interopRequireDefault(require("../models/User"));

var _mock = _interopRequireDefault(require("../data/mock"));

var _validation = _interopRequireDefault(require("../helpers/validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var auth = {
  register: function register(req, res) {
    var _req$body = req.body,
        firstName = _req$body.firstName,
        lastName = _req$body.lastName,
        email = _req$body.email,
        password = _req$body.password,
        address = _req$body.address;

    var result = _joi["default"].validate(req.body, _validation["default"].userSchema, {
      abortEarly: false
    });

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

    var uniqueUser = _mock["default"].users.filter(function (user) {
      return user.email === email;
    });

    if (uniqueUser.length === 1) {
      return res.status(404).json({
        status: 404,
        error: "User with this email:".concat(JSON.stringify(email), " is already registered")
      });
    }

    var id = _mock["default"].users.length + 1;
    var status = 'unverified';
    var createdOn = (0, _moment["default"])().format('MMMM Do YYYY, h:mm:ss a');
    var isAdmin = 'false';
    var user = new _User["default"](id, firstName, lastName, email, password, address, status, isAdmin, createdOn);

    var hash = _bcryptjs["default"].hashSync(user.password, 10);

    user.password = hash;

    var token = _jsonwebtoken["default"].sign({
      user: _mock["default"].users.push(user)
    }, 'secret-key');

    return res.status(201).send({
      status: res.statusCode,
      data: {
        token: token,
        id: user.id,
        fistName: firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
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

    var _Joi$validate = _joi["default"].validate(req.body, _validation["default"].loginSchema),
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

    for (var i = 0; i < _mock["default"].users.length; i++) {
      if (_mock["default"].users[i].email === email) {
        var id = _mock["default"].users[i].id;
        var firstName = _mock["default"].users[i].firstName;
        var lastName = _mock["default"].users[i].lastName;
        var status = _mock["default"].users[i].status;
        var isAdmin = _mock["default"].users[i].isAdmin;
        var createdOn = _mock["default"].users[i].createdOn;

        var truePass = _bcryptjs["default"].compareSync(password, _mock["default"].users[i].password);

        if (truePass) {
          var token = _jsonwebtoken["default"].sign({
            user: _mock["default"].users[i].password
          }, 'secret-key', {
            expiresIn: '1h'
          });

          return res.status(200).send({
            status: res.statusCode,
            data: {
              token: token,
              id: id,
              firstName: firstName,
              lastName: lastName,
              email: email,
              status: status,
              isAdmin: isAdmin,
              createdOn: createdOn
            }
          });
        }

        return res.status(400).send({
          status: res.statusCode,
          error: 'incorrect password'
        });
      }
    }

    return res.status(400).send({
      status: 400,
      error: 'invalid email'
    });
  }
};
var _default = auth;
exports["default"] = _default;