// User queries
const insertUser = `INSERT INTO users(firstName, lastName, email, password, address, status, isAdmin, createdOn, updatedOn)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`;
const allUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = $1';
const getUserByEmail = 'SELECT * FROM users WHERE email = $1;';
const verifyUser = 'UPDATE users SET status=$1, updatedOn=$2 WHERE email=$3 RETURNING *';

// Loan queries
const insertLoan = `INSERT INTO loans(userEmail, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest, updatedOn)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`;
const getLoan = 'SELECT * FROM loans WHERE id = $1';
const retrieveAllLoans = 'SELECT * FROM loans';
const repaidLoans = 'SELECT * FROM loans where status = $1 AND repaid = $2';
const approveOrRejectLoan = 'UPDATE loans SET status=$1, updatedOn=$2 WHERE id=$3 RETURNING *';

// Repayment queries
const insertRepayment = `INSERT INTO repayments(loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn)
     VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`;
const repaymentHistory = 'SELECT * FROM repayments where loanId = $1';

export default {
  insertUser,
  allUsers,
  getUserById,
  getUserByEmail,
  verifyUser,
  insertLoan,
  getLoan,
  retrieveAllLoans,
  repaidLoans,
  approveOrRejectLoan,
  insertRepayment,
  repaymentHistory,
};
