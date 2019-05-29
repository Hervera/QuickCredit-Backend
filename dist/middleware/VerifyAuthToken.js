'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _connection = require('../data/connection');

var _connection2 = _interopRequireDefault(_connection);

var _queries = require('../data/queries');

var _queries2 = _interopRequireDefault(_queries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var AuthMiddleware = function () {
  function AuthMiddleware() {
    _classCallCheck(this, AuthMiddleware);
  }

  _createClass(AuthMiddleware, null, [{
    key: 'verifyToken',
    value: async function verifyToken(req, res, next) {
      var authorizationHeader = req.headers.authorization;
      if (authorizationHeader) {
        var token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        var options = {
          expiresIn: '30min'
        };
        try {
          var user = _jsonwebtoken2.default.verify(token, '' + process.env.SECRET_KEY_CODE, options);

          var _ref = await _connection2.default.query(_queries2.default.getUserById, [user.id]),
              rows = _ref.rows;

          if (!rows[0]) {
            return res.status(400).send({
              status: res.statusCode,
              error: 'Token expired'
            });
          }
          req.decoded = user;
          return next();
        } catch (error) {
          // Throw an error just in case anything goes wrong with verification
          return res.status(400).send({
            status: res.statusCode,
            error: 'Invalid token'
          });
        }
      } else {
        // Forbidden
        return res.status(403).send({
          status: res.statusCode,
          error: "'Unauthorized, No token provided"
        });
      }
    }
  }, {
    key: 'verifyAdmin',
    value: function verifyAdmin(req, res, next) {
      var payload = req.decoded;
      if (payload && payload.isadmin === true) {
        next();
      } else {
        res.status(401).send({
          status: res.statusCode,
          error: 'Unauthorized, Contact QuickQredit admin'
        });
      }
    }
  }, {
    key: 'verifyClient',
    value: function verifyClient(req, res, next) {
      var payload = req.decoded;
      if (payload && payload.email === req.body.useremail) {
        next();
      } else {
        res.status(401).send({
          status: res.statusCode,
          error: 'Unauthorized'
        });
      }
    }
  }]);

  return AuthMiddleware;
}();

exports.default = AuthMiddleware;