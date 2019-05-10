import Joi from 'joi';
import moment from 'moment';
import Loan from '../models/Loan';
import mock from '../data/mock';
import validate from '../helpers/validation';

const loans = {

  retrieveLoans(req, res) {
    // Get all current loans that are not fully repaid.
    const reqStatus = req.query.status;
    const reqRepaid = req.query.repaid;
    const reqLoans = mock.loans.filter(result => result.status === reqStatus && result.repaid === reqRepaid);

    if (reqLoans.length !== 0) {
      res.status(200).json({
        status: res.statusCode,
        data: reqLoans,
      });
    } else if (reqStatus == null && reqRepaid == null && mock.loans !== 0) {
      res.status(200).json({
        status: res.statusCode,
        data: mock.loans,
      });
    } else {
      res.status(404).json({
        status: res.statusCode,
        error: 'No loan found',
      });
    }
  },

  // Get specific loan details
  getSpecificLoan(req, res) {
    const id = parseInt(req.params.id, 10);
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
    mock.loans.map((loan) => {
      if (loan.id === id) {
        return res.status(200).json({
          status: 200,
          data: loan,
        });
      }
      return loan;
    });
    return res.status(404).json({
      status: 404,
      error: 'Loan is not found',
    });
  },

  createLoan(req, res) {
    const {
      user, tenor, amount,
    } = req.body;

    const result = Joi.validate(req.body, validate.loanSchema, { abortEarly: false });

    if (result.error) {
      const errors = [];
      for (let index = 0; index < result.error.details.length; index++) {
        errors.push(result.error.details[index].message.split('"').join(''));
      }
      return res.status(400).send({
        status: res.statusCode,
        error: errors,
      });
    }

    const id = mock.loans.length + 1;
    const status = 'pending';
    const repaid = 'false';
    const interest = 5;
    const paymentInstallment = (amount + interest) / tenor;
    const balance = 0;
    const createdOn = moment().format('MMMM Do YYYY, h:mm:ss a');
    const loan = new Loan(
      id, user, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest,
    );

    const checkUser = mock.users.filter(verifyUser => verifyUser.email === user);
    if (checkUser.length === 0) {
      res.status(404).json({
        status: 404,
        error: 'The user with that email is not registered',
      });
    }
    return res.status(201).send({
      status: res.statusCode,
      data: {
        id: loan.id,
        user: loan.user,
        createdOn: loan.createdOn,
        repaid: loan.repaid,
        tenor: loan.tenor,
        amount: loan.amount,
        paymentInstallment: loan.paymentInstallment,
        balance: loan.balance,
        interest: loan.interest,
      },
    });
  },

  approveOrRejectLoan(req, res) {
    const id = parseInt(req.params.id, 10);
    const { error } = Joi.validate(
      {
        id,
      },
      validate.idParams,
    );

    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message, // error.details to view more about the error
      });
    }
    mock.loans.map((loan) => {
      if (loan.id === id) {
        loan.status = req.body.status;
        return res.status(200).json({
          status: 200,
          data: loan,
        });
      }
      return loan;
    });
    return res.status(404).json({
      status: 404,
      error: 'Loan is not found',
    });
  },
};

export default loans;
