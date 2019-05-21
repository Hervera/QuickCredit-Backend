import Joi from 'joi';
import moment from 'moment';
import Loan from '../models/Loan';
import mock from '../data/mock';
import db from '../data/connection';
import validate from '../helpers/validation';
import queries from '../data/queries';

class LoanController {
  static retrieveLoans(req, res) {
    // Get all current loans that are not fully repaid.
    const reqStatus = req.query.status;
    const reqRepaid = req.query.repaid;
    const reqLoans = mock.loans.filter(result => result.status === reqStatus && result.repaid === reqRepaid);

    if (reqLoans.length !== 0) {
      res.status(200).send({
        status: res.statusCode,
        data: reqLoans,
      });
    } else if (reqStatus == null && reqRepaid == null && mock.loans !== 0) {
      res.status(200).send({
        status: res.statusCode,
        data: mock.loans,
      });
    } else {
      res.status(404).send({
        status: res.statusCode,
        error: 'No loan found',
      });
    }
  }

  // Get specific loan details
  static getSpecificLoan(req, res) {
    const id = parseInt(req.params.id, 10);
    const { error } = Joi.validate(
      {
        id,
      },
      validate.idParams,
    );

    if (error) {
      return res.status(400).send({
        status: res.statusCode,
        error: error.details[0].message,
      });
    }

    const loan = mock.loans.find(el => el.id === id);
    if (loan) {
      return res.status(200).json({
        status: 200,
        data: loan,
      });
    }
    return res.status(404).send({
      status: 404,
      error: 'Loan is not found',
    });
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
        res.status(400).send({
          status: res.statusCode,
          error: errors,
        });
      }

      const status = 'pending';
      const repaid = 'false';
      const interest = amount * 0.05;
      const paymentInstallment = (amount + interest) / tenor;
      const balance = 0;
      const createdOn = moment().format('LL');
      const updatedOn = moment().format('LL');
      const loan = new Loan(
        userEmail, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest, updatedOn,
      );
      const { rows } = await db.query(queries.retrieveSpecificUser, [userEmail]);
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
      return res.status(201).send({
        status: res.statusCode,
        data: {
          loanId: newLoan.rows[0].id,
          firstName: nameFirst,
          lastName: nameLast,
          email: newLoan.rows[0].userEmail,
          tenor: newLoan.rows[0].tenor,
          amount: newLoan.rows[0].amount,
          paymentInstallment: newLoan.rows[0].paymentInstallment,
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

  static approveOrRejectLoan(req, res) {
    const id = parseInt(req.params.id, 10);
    const { error } = Joi.validate(
      {
        id,
      },
      validate.idParams,
    );

    if (error) {
      return res.status(400).send({
        status: res.statusCode,
        error: error.details[0].message, // error.details to view more about the error
      });
    }

    const loan = mock.loans.find(el => el.id === id);
    if (loan) {
      loan.status = req.body.status;
      return res.status(200).send({
        status: 200,
        data: loan,
      });
    }
    return res.status(404).send({
      status: 404,
      error: 'Loan is not found',
    });
  }
}

export default LoanController;
