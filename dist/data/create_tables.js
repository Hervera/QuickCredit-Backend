'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropTables = exports.createTables = undefined;

var _pg = require('pg');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var pool = new _pg.Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', function () {
  console.log('connected to the db');
});

/**
 * Create Tables
 */

var createTables = function createTables() {
  return new Promise(async function (resolve, reject) {
    var queryText = 'CREATE TABLE IF NOT EXISTS\n    users(\n      id SERIAL NOT NULL PRIMARY KEY,\n      firstName VARCHAR(255) NOT NULL,\n      lastName VARCHAR(255) NOT NULL,\n      email VARCHAR(255) UNIQUE NOT NULL,\n      password VARCHAR(255) NOT NULL,\n      address VARCHAR(255) NOT NULL,\n      isAdmin BOOLEAN NOT NULL,\n      status VARCHAR(255) NOT NULL,\n      createdOn TIMESTAMP,\n      updatedOn TIMESTAMP\n    );\n\n    CREATE TABLE IF NOT EXISTS\n    loans(\n      id SERIAL NOT NULL PRIMARY KEY,\n      userEmail VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,\n      status VARCHAR(255) NOT NULL,\n      repaid BOOLEAN NOT NULL,\n      tenor INTEGER NOT NULL,\n      amount NUMERIC NOT NULL,\n      paymentInstallment VARCHAR(255) NOT NULL,\n      balance NUMERIC NOT NULL,\n      interest NUMERIC NOT NULL,\n      createdOn TIMESTAMP,\n      updatedOn TIMESTAMP\n    );\n\n    CREATE TABLE IF NOT EXISTS\n    repayments(\n      id SERIAL NOT NULL PRIMARY KEY,\n      loanId INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,\n      paidAmount NUMERIC NOT NULL,\n      monthlyInstallment VARCHAR(255) NOT NULL,\n      repaid BOOLEAN NOT NULL,\n      balance NUMERIC NOT NULL,\n      remain NUMERIC NOT NULL,\n      createdOn TIMESTAMP\n    );';

    try {
      await pool.query(queryText);
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
    var queryText = 'DROP TABLE IF EXISTS users CASCADE;\n                     DROP TABLE IF EXISTS loans CASCADE;\n                     DROP TABLE IF EXISTS repayments CASCADE;\n                    ';

    try {
      await pool.query(queryText);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.createTables = createTables;
exports.dropTables = dropTables;


require('make-runnable');