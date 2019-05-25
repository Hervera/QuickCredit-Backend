import Joi from 'joi';
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
      return res.status(500).json({
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
          createdon: rows[0].createdon,
          status: rows[0].status,
          repaid: rows[0].repaid,
          tenor: rows[0].tenor,
          amount: rows[0].amount,
          paymentinstallment: rows[0].paymentinstallment,
          balance: rows[0].balance,
          interest: rows[0].interest,
          updatedon: rows[0].updatedon,
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
        useremail, tenor, amount,
      } = req.body;

      const { error } = Joi.validate(req.body, validate.loanSchema);
      if (error) {
        const errors = [];
        for (let index = 0; index < error.details.length; index++) {
          errors.push(error.details[index].message.split('"').join(''));
        }
        return res.status(400).send({
          status: res.statusCode,
          error: errors,
        });
      }

      const status = 'pending';
      const repaid = 'false';
      const interest = amount * 0.05;
      const paymentinstallment = (amount + interest) / tenor;
      const balance = 0;
      const createdon = new Date();
      const updatedon = new Date();
      const loan = new Loan(
        useremail, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest, updatedon,
      );
      const { rows } = await db.query(queries.getUserByEmail, [useremail]);
      if (!rows[0]) {
        return res.status(404).json({ status: res.statusCode, error: 'That user is not registered' });
      }
      if (rows.length !== 0 && rows[0].status !== 'verified') {
        return res.status(404).json({ status: res.statusCode, error: `User with this email: "${useremail}" is not yet verified` });
      }
      const userWithLoan = await db.query(queries.fetchUserInLoan, [useremail]);
      if (userWithLoan.rows.length !== 0) {
        if (userWithLoan.rows[0].status === 'pending') {
          return res.status(404).json({ status: res.statusCode, error: 'You still have a loan pending' });
        }
        if (userWithLoan.rows[0].repaid === false) {
          return res.status(404).json({ status: res.statusCode, error: 'You still have an unrepaid loan' });
        }
      }
      const nameFirst = rows[0].firstname;
      const nameLast = rows[0].lastname;
      const values = [
        loan.useremail, loan.createdon, loan.status, loan.repaid, loan.tenor, loan.amount, loan.paymentinstallment,
        loan.balance, loan.interest, loan.updatedon,
      ];
      const newLoan = await db.query(queries.insertLoan, values);
      return res.status(201).json({
        status: res.statusCode,
        data: {
          loanid: newLoan.rows[0].id,
          firstname: nameFirst,
          lastname: nameLast,
          email: newLoan.rows[0].useremail,
          tenor: newLoan.rows[0].tenor,
          amount: newLoan.rows[0].amount,
          paymentinstallment: newLoan.rows[0].paymentinstallment,
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
      const updateDate = new Date();
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
          createdon: updatedLoan.rows[0].createdon,
          updatedon: updatedLoan.rows[0].updatedon,
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
