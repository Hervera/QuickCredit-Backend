'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createTables = 'CREATE TABLE IF NOT EXISTS\n    users(\n      id SERIAL NOT NULL PRIMARY KEY,\n      firstname VARCHAR(255) NOT NULL,\n      lastname VARCHAR(255) NOT NULL,\n      email VARCHAR(255) UNIQUE NOT NULL,\n      password VARCHAR(255) NOT NULL,\n      address VARCHAR(255) NOT NULL,\n      isadmin BOOLEAN NOT NULL,\n      status VARCHAR(255) NOT NULL,\n      createdon TIMESTAMP,\n      updatedon TIMESTAMP\n    );\n\n    CREATE TABLE IF NOT EXISTS\n    loans(\n      id SERIAL NOT NULL PRIMARY KEY,\n      useremail VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,\n      status VARCHAR(255) NOT NULL,\n      repaid BOOLEAN NOT NULL,\n      tenor INTEGER NOT NULL,\n      amount NUMERIC NOT NULL,\n      paymentinstallment VARCHAR(255) NOT NULL,\n      balance NUMERIC NOT NULL,\n      interest NUMERIC NOT NULL,\n      createdon TIMESTAMP,\n      updatedon TIMESTAMP\n    );\n\n    CREATE TABLE IF NOT EXISTS\n    repayments(\n      id SERIAL NOT NULL PRIMARY KEY,\n      loanid INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,\n      paidamount NUMERIC NOT NULL,\n      monthlyinstallment VARCHAR(255) NOT NULL,\n      repaid BOOLEAN NOT NULL,\n      balance NUMERIC NOT NULL,\n      remain NUMERIC NOT NULL,\n      createdon TIMESTAMP\n    );';

var dropTables = 'DROP TABLE IF EXISTS users CASCADE;\n                     DROP TABLE IF EXISTS loans CASCADE;\n                     DROP TABLE IF EXISTS repayments CASCADE;\n                    ';

// User queries
var insertUser = 'INSERT INTO users(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon)\n            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *';
var insertAdmin = 'INSERT INTO users(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon)\n            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING returning *';
var allUsers = 'SELECT * FROM users';
var getUserById = 'SELECT * FROM users WHERE id = $1';
var getUserByEmail = 'SELECT * FROM users WHERE email = $1;';
var verifyUser = 'UPDATE users SET status=$1, updatedon=$2 WHERE email=$3 RETURNING *';

// Loan queries
var insertLoan = 'INSERT INTO loans(useremail, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest, updatedon)\n     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *';
var getLoan = 'SELECT * FROM loans WHERE id = $1';
var retrieveAllLoans = 'SELECT * FROM loans';
var repaidLoans = 'SELECT * FROM loans where status = $1 AND repaid = $2';
var approveOrRejectLoan = 'UPDATE loans SET status=$1, updatedon=$2 WHERE id=$3 RETURNING *';
var fetchUserInLoan = 'SELECT * FROM loans WHERE useremail = $1';

// Repayment queries
var insertRepayment = 'INSERT INTO repayments(loanid, monthlyinstallment, paidamount, repaid, balance, remain, createdon)\n     VALUES ($1, $2, $3, $4, $5, $6, $7) returning *';
var repaymentHistory = 'SELECT * FROM repayments where loanid = $1';

exports.default = {
  createTables: createTables,
  dropTables: dropTables,
  insertUser: insertUser,
  insertAdmin: insertAdmin,
  allUsers: allUsers,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  verifyUser: verifyUser,
  insertLoan: insertLoan,
  getLoan: getLoan,
  retrieveAllLoans: retrieveAllLoans,
  repaidLoans: repaidLoans,
  approveOrRejectLoan: approveOrRejectLoan,
  fetchUserInLoan: fetchUserInLoan,
  insertRepayment: insertRepayment,
  repaymentHistory: repaymentHistory
};