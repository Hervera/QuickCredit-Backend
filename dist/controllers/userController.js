'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _connection = require('../data/connection');

var _connection2 = _interopRequireDefault(_connection);

var _queries = require('../data/queries');

var _queries2 = _interopRequireDefault(_queries);

var _validation = require('../helpers/validation');

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: 'getAllUsers',

    // Get all users
    value: async function getAllUsers(req, res) {
      try {
        var allUsers = await _connection2.default.query(_queries2.default.allUsers);
        if (allUsers.rows.length === 0) {
          res.status(404).json({
            status: 404,
            error: 'No user found'
          });
        }
        var newUsersArray = allUsers.rows.map(function (eachItem) {
          var item = eachItem;
          delete item.password;
          return item;
        });
        return res.status(200).json({
          status: 200,
          successMessage: 'Users',
          data: newUsersArray
        });
      } catch (er) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + er
        });
      }
    }

    // Get a specific user details

  }, {
    key: 'getSpecificUser',
    value: async function getSpecificUser(req, res) {
      try {
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
        var user = await _connection2.default.query(_queries2.default.getUserById, [id]);
        if (user.rows.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'User is not found'
          });
        }
        return res.status(200).json({
          status: 200,
          data: {
            id: user.rows[0].id,
            email: user.rows[0].email,
            firstname: user.rows[0].firstname,
            lastname: user.rows[0].lastname,
            status: user.rows[0].status,
            address: user.rows[0].address,
            isadmin: user.rows[0].isadmin,
            createdon: user.rows[0].createdon
          }
        });
      } catch (er) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + er
        });
      }
    }
  }, {
    key: 'verifyUser',
    value: async function verifyUser(req, res) {
      try {
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
        var user = await _connection2.default.query(_queries2.default.getUserByEmail, [email]);
        if (user.rows.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'User is not found'
          });
        }
        var updateDate = (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss');
        var updatedUser = await _connection2.default.query(_queries2.default.verifyUser, ['verified', updateDate, user.rows[0].email]);
        return res.status(200).json({
          status: 200,
          data: {
            id: updatedUser.rows[0].id,
            email: updatedUser.rows[0].email,
            firstname: updatedUser.rows[0].firstname,
            lastname: updatedUser.rows[0].lastname,
            status: updatedUser.rows[0].status,
            address: updatedUser.rows[0].address,
            isadmin: updatedUser.rows[0].isadmin,
            createdon: updatedUser.rows[0].createdon,
            updatedon: updatedUser.rows[0].updatedon
          }
        });
      } catch (er) {
        return res.status(500).json({
          status: res.statusCode,
          error: '' + er
        });
      }
    }
  }]);

  return UserController;
}();

exports.default = UserController;