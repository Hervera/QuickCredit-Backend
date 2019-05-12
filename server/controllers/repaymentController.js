import Joi from 'joi';
import moment from 'moment';
import Repayment from '../models/Repayment';
import mock from '../data/mock';
import validate from '../helpers/validation';

const repayments = {

  loanRepaymentHistory(req, res) {
    const id = parseInt(req.params.id, 10);
    const repaymentHistory = mock.repayments.filter(result => result.loanId === id);
    const { error } = Joi.validate(
      {
        id,
      },
      validate.idParams,
    );
    if (error) {
      res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message,
      });
    } else if (repaymentHistory.length !== 0) {
      res.status(200).json({
        status: res.statusCode,
        data: repaymentHistory,
      });
    } else {
      res.status(404).json({
        status: res.statusCode,
        error: 'There is no repayment history for that loan',
      });
    }
  },

  createLoanRepayment(req, res) {
    const loanId = parseInt(req.params.id, 10);
    const checkLoanId = mock.loans.find(result => result.id === loanId && result.status === 'approved');
    const repaidTrue = mock.loans.find(result => result.id === loanId && result.repaid === 'true');
    const { error } = Joi.validate(
      {
        loanId,
      },
      validate.loanIdParams,
    );
    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message,
      });
    }
    if (repaidTrue) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The loan has been fully repaid',
      });
    }
    if (!checkLoanId) {
      return res.status(404).json({
        status: res.statusCode,
        error: 'The loan doesn\'t exist',
      });
    }

    // Validate the inputs in body
    const {
      paidAmount,
    } = req.body;
    const result = Joi.validate(req.body, validate.repaymentSchema, { abortEarly: false });

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

    const id = mock.repayments.length + 1;
    const createdOn = moment().format('MMMM Do YYYY, h:mm:ss a');
    const monthlyInstallment = 4; // bring back paymentInstallment of that specific loan; (work on this later)
    const amount = 600000; // bring back loan amount of that specific loan; (work on this later)
    const interest = 0.20; // bring back interest of that specific loan; (work on this later)
    const balance = 50000; //  balance = paidAmount + lastBalance; (work on this later)
    const remain = 40000; // remain = amount - balance; (work on this later)
    const repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
    const repayment = new Repayment(
      id, loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn, amount, interest,
    );
    return res.status(201).send({
      status: res.statusCode,
      data: {
        id: repayment.id,
        loanId: repayment.loanId,
        monthlyInstallment: repayment.monthlyInstallment,
        paidAmount: repayment.paidAmount,
        amount: repayment.amount,
        interest: repayment.interest,
        repaid: repayment.repaid,
        balance: repayment.balance,
        remain: repayment.remain,
        CreatedOn: repayment.createdOn,
      },
    });
  },
};

export default repayments;
