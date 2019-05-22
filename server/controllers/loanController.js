import Joi from 'joi';
import moment from 'moment';
import Loan from '../models/Loan';
import db from '../data/connection';
import validate from '../helpers/validation';
import queries from '../data/queries';

class LoanController {
  static async retrieveLoans(req, res) {
    try {
      // Get all current loans
      const { rows, rowCount } = await db.query(queries.retrieveAllLoans);
      const reqStatus = req.query.status;
      const reqRepaid = req.query.repaid;

      // Get all loans which safisfies the requested status and the requested repaid
      const reqLoans = await db.query(queries.repaidLoans, [reqStatus, reqRepaid]);
      if (reqLoans.rows.length !== 0) {
        return res.status(200).json({
          status: res.statusCode,
          data: reqLoans.rows,
        });
      }
      if (reqStatus == null && reqRepaid == null && rows.length !== 0) {
        return res.status(200).json({
          status: res.statusCode,
          total: rowCount,
          data: rows,
        });
      }
      return res.status(404).json({
        status: res.statusCode,
        error: 'No loan found',
      });
    } catch (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: `${error}`,
      });
    }
  }

  // Get specific loan details
  static async getSpecificLoan(req, res) {
    try {
      const { id } = req.params;
      const { error } = Joi.validate(
        {
          id,
        },
        validate.idParams,
      );
      if (error) {
        return res.status(400).json({
          status: res.statusCode,
          error: error.details[0].message,
        });
      }
      const { rows } = await db.query(queries.getLoan, [req.params.id]);

      if (!rows[0]) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'Loan is not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: {
          id: 2,
          user: rows[0].useremail,
          createdOn: rows[0].createdon,
          status: rows[0].status,
          repaid: rows[0].repaid,
          tenor: rows[0].tenor,
          amount: rows[0].amount,
          paymentInstallment: rows[0].paymentinstallment,
          balance: rows[0].balance,
          interest: rows[0].interest,
          updatedOn: rows[0].updatedon,
        },
      });
    } catch (er) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${er}`,
      });
    }
  }

  static async createLoan(req, res) {
    try {
      const {
        userEmail, tenor, amount,
      } = req.body;

      const result = Joi.validate(req.body, validate.loanSchema, { abortEarly: false });

      if (result.error) {
        const errors = [];
        for (let index = 0; index < result.error.details.length; index++) {
          errors.push(result.error.details[index].message.split('"').join(''));
        }
        return res.status(400).json({
          status: res.statusCode,
          error: errors,
        });
      }

      const status = 'pending';
      const repaid = 'false';
      const interest = amount * 0.05;
      const paymentInstallment = (amount + interest) / tenor;
      const balance = 0;
      const createdOn = moment().format('YYYY-MM-DD HH:mm:ss');
      const updatedOn = moment().format('YYYY-MM-DD HH:mm:ss');
      const loan = new Loan(
        userEmail, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest, updatedOn,
      );
      const { rows } = await db.query(queries.getUserByEmail, [userEmail]);
      if (!rows[0]) {
        return res.status(404).json({ status: res.statusCode, error: 'That user is not registered' });
      }
      const nameFirst = rows[0].firstname;
      const nameLast = rows[0].lastname;

      const values = [
        loan.userEmail, loan.createdOn, loan.status, loan.repaid, loan.tenor, loan.amount, loan.paymentInstallment,
        loan.balance, loan.interest, loan.updatedOn,
      ];
      const newLoan = await db.query(queries.insertLoan, values);
      return res.status(201).json({
        status: res.statusCode,
        data: {
          loanId: newLoan.rows[0].id,
          firstName: nameFirst,
          lastName: nameLast,
          email: newLoan.rows[0].userEmail,
          tenor: newLoan.rows[0].tenor,
          amount: newLoan.rows[0].amount,
          paymentInstallment: newLoan.rows[0].paymentinstallment,
          status: newLoan.rows[0].status,
          balance: newLoan.rows[0].balance,
          interest: newLoan.rows[0].interest,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${error}`,
      });
    }
  }

  static async approveOrRejectLoan(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const { error } = Joi.validate({ id, status }, validate.loanStatusSchema, { abortEarly: false });
      if (error != null) {
        const errors = [];
        for (let index = 0; index < error.details.length; index++) {
          errors.push(error.details[index].message.split('"').join(''));
        }
        return res.status(400).json({
          status: res.statusCode,
          error: errors,
        });
      }
      const findLoan = await db.query(queries.getLoan, [req.params.id]);
      if (findLoan.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'Loan is not found',
        });
      }
      const updateDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const updatedLoan = await db.query(queries.approveOrRejectLoan, [req.body.status, updateDate, findLoan.rows[0].id]);
      return res.status(200).json({
        status: 200,
        data: {
          LoanId: 2,
          LoanAmount: updatedLoan.rows[0].amount,
          tenor: updatedLoan.rows[0].tenor,
          status: updatedLoan.rows[0].status,
          monthlyInstallment: updatedLoan.rows[0].paymentinstallment,
          interest: updatedLoan.rows[0].interest,
          user: updatedLoan.rows[0].useremail,
          repaid: updatedLoan.rows[0].repaid,
          balance: updatedLoan.rows[0].balance,
          createdOn: updatedLoan.rows[0].createdon,
          updatedOn: updatedLoan.rows[0].updatedon,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${error}`,
      });
    }
  }
}

export default LoanController;
