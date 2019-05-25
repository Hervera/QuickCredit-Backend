const createTables = `CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL NOT NULL PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      isadmin BOOLEAN NOT NULL,
      status VARCHAR(255) NOT NULL,
      createdon TIMESTAMP,
      updatedon TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS
    loans(
      id SERIAL NOT NULL PRIMARY KEY,
      useremail VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
      status VARCHAR(255) NOT NULL,
      repaid BOOLEAN NOT NULL,
      tenor INTEGER NOT NULL,
      amount NUMERIC NOT NULL,
      paymentinstallment VARCHAR(255) NOT NULL,
      balance NUMERIC NOT NULL,
      interest NUMERIC NOT NULL,
      createdon TIMESTAMP,
      updatedon TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS
    repayments(
      id SERIAL NOT NULL PRIMARY KEY,
      loanid INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
      paidamount NUMERIC NOT NULL,
      monthlyinstallment VARCHAR(255) NOT NULL,
      repaid BOOLEAN NOT NULL,
      balance NUMERIC NOT NULL,
      remain NUMERIC NOT NULL,
      createdon TIMESTAMP
    );`;


const dropTables = `DROP TABLE IF EXISTS users CASCADE;
                     DROP TABLE IF EXISTS loans CASCADE;
                     DROP TABLE IF EXISTS repayments CASCADE;
                    `;

// User queries
const insertUser = `INSERT INTO users(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`;
const insertAdmin = `INSERT INTO users(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING returning *`;
const allUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = $1';
const getUserByEmail = 'SELECT * FROM users WHERE email = $1;';
const verifyUser = 'UPDATE users SET status=$1, updatedon=$2 WHERE email=$3 RETURNING *';

// Loan queries
const insertLoan = `INSERT INTO loans(useremail, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest, updatedon)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`;
const getLoan = 'SELECT * FROM loans WHERE id = $1';
const retrieveAllLoans = 'SELECT * FROM loans';
const repaidLoans = 'SELECT * FROM loans where status = $1 AND repaid = $2';
const approveOrRejectLoan = 'UPDATE loans SET status=$1, updatedon=$2 WHERE id=$3 RETURNING *';
const fetchUserInLoan = 'SELECT * FROM loans WHERE useremail = $1';

// Repayment queries
const insertRepayment = `INSERT INTO repayments(loanid, monthlyinstallment, paidamount, repaid, balance, remain, createdon)
     VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`;
const repaymentHistory = 'SELECT * FROM repayments where loanid = $1';

export default {
  createTables,
  dropTables,
  insertUser,
  insertAdmin,
  allUsers,
  getUserById,
  getUserByEmail,
  verifyUser,
  insertLoan,
  getLoan,
  retrieveAllLoans,
  repaidLoans,
  approveOrRejectLoan,
  fetchUserInLoan,
  insertRepayment,
  repaymentHistory,
};
