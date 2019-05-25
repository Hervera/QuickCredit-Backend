'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _connection = require('../data/connection');

var _connection2 = _interopRequireDefault(_connection);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

var _queries = require('../data/queries');

var _queries2 = _interopRequireDefault(_queries);

var _passwordCompare = require('../helpers/passwordCompare');

var _passwordCompare2 = _interopRequireDefault(_passwordCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var AuthController = function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }

  _createClass(AuthController, null, [{
    key: 'register',
    value: async function register(req, res) {
      var _req$body = req.body,
          firstname = _req$body.firstname,
          lastname = _req$body.lastname,
          email = _req$body.email,
          password = _req$body.password,
          address = _req$body.address;

      var _Joi$validate = _joi2.default.validate(req.body, _validation2.default.userSchema),
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
      var status = 'unverified';
      var createdon = new Date();
      var updatedon = new Date();
      var isadmin = 'false';
      var user = new _User2.default(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon);
      var hash = _bcryptjs2.default.hashSync(user.password, 10);
      user.password = hash;
      var values = [user.firstname, user.lastname, user.email, user.password, user.address, user.status, user.isadmin, user.createdon, user.updatedon];
      try {
        var payload = await _connection2.default.query(_queries2.default.insertUser, values);
        // create token
        var token = _jsonwebtoken2.default.sign(payload.rows[0], '' + process.env.SECRET_KEY_CODE, { expiresIn: '30min' });
        return res.status(201).send({
          status: res.statusCode,
          data: {
            token: token,
            id: payload.rows[0].id,
            firstName: payload.rows[0].firstname,
            lastName: payload.rows[0].lastname,
            email: payload.rows[0].email,
            address: payload.rows[0].address,
            status: payload.rows[0].status,
            isAdmin: payload.rows[0].isadmin,
            createdOn: payload.rows[0].createdon
          }
        });
      } catch (error) {
        if (error.routine === '_bt_check_unique') {
          return res.status(409).json({
            status: res.statusCode,
            error: 'User with that EMAIL already exist'
          });
        }
        return res.status(500).json({ status: 500, error: 'error ' + error });
      }
    }
  }, {
    key: 'login',
    value: async function login(req, res) {
      var _Joi$validate2 = _joi2.default.validate(req.body, _validation2.default.loginSchema),
          error = _Joi$validate2.error;

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
      try {
        var _ref = await _connection2.default.query(_queries2.default.getUserByEmail, [req.body.email]),
            rows = _ref.rows;

        if (rows.length === 0) {
          return res.status(400).send({
            status: res.statusCode,
            error: 'User with that email is not found'
          });
        }
        if (!_passwordCompare2.default.comparePassword(rows[0].password, req.body.password)) {
          return res.status(400).json({
            status: res.statusCode,
            error: 'Incorrect password'
          });
        }
        var options = { expiresIn: '30min' };
        var token = _jsonwebtoken2.default.sign(rows[0], '' + process.env.SECRET_KEY_CODE, options);
        return res.status(200).send({
          status: res.statusCode,
          data: {
            token: token,
            id: rows[0].id,
            firstName: rows[0].firstname,
            lastName: rows[0].lastname,
            isAdmin: rows[0].isadmin,
            email: rows[0].email,
            address: rows[0].address,
            status: rows[0].status,
            createdOn: rows[0].createdon,
            updatedOn: rows[0].updatedon
          }
        });
      } catch (er) {
        return res.status(400).send({
          status: res.statusCode,
          error: 'error ' + er
        });
      }
    }
  }]);

  return AuthController;
}();

exports.default = AuthController;