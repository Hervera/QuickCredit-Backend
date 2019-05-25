'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropTables = exports.createTables = undefined;

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _queries = require('./queries');

var _queries2 = _interopRequireDefault(_queries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var pool = {};
if (process.env.NODE_ENV === 'test') {
  pool = new _pg2.default.Pool({
    connectionString: process.env.DATABASE_TEST_URL
  });
} else {
  pool = new _pg2.default.Pool({
    connectionString: process.env.DATABASE_URL
  });
}

/**
 * Create Tables
 */
var createTables = function createTables() {
  return new Promise(async function (resolve, reject) {
    try {
      await pool.query(_queries2.default.createTables);

      var admin = ['Herve', 'Nkurikiyimfura', 'admin@gmail.com', _bcryptjs2.default.hashSync('secret', 10), 'Kigali, Rwanda', 'verified', 'true', new Date(), new Date()];
      await pool.query(_queries2.default.insertAdmin, admin);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Drop Tables
 */
var dropTables = function dropTables() {
  return new Promise(async function (resolve, reject) {
    try {
      await pool.query(_queries2.default.dropTables);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.createTables = createTables;
exports.dropTables = dropTables;


require('make-runnable');