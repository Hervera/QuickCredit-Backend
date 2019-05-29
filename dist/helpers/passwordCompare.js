'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Helper = {
  hashPassword: function hashPassword(password) {
    return _bcryptjs2.default.hashSync(password, _bcryptjs2.default.genSaltSync(8));
  },
  comparePassword: function comparePassword(hashPassword, password) {
    return _bcryptjs2.default.compareSync(password, hashPassword);
  }
};

exports.default = Helper;