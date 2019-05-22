import Joi from 'joi';
import moment from 'moment';
import Repayment from '../models/Repayment';
import mock from '../data/mock';
import validate from '../helpers/validation';
import db from '../data/connection';
import queries from '../data/queries';


class RepaymentController {
  static loanRepaymentHistory(req, res) {
    const id = Number(req.params.id);
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
  }

  static async createLoanRepayment(req, res) {
    try {
      const loanId = parseInt(req.params.id, 10);
      const { paidAmount } = req.body;
      const result = Joi.validate({ loanId, paidAmount }, validate.repaymentSchema, { abortEarly: false });
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
      const checkedLoan = await db.query(queries.getLoan, [req.params.id]);
      if (!checkedLoan.rows[0]) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'The loan doesn\'t exist',
        });
      }
      const currentStatus = checkedLoan.rows[0].status;
      const currentRepaid = checkedLoan.rows[0].repaid;
      const currentAmount = checkedLoan.rows[0].amount;
      const currentBalance = checkedLoan.rows[0].balance;
      if (currentStatus === 'approved' && currentRepaid === true) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'The loan has been fully repaid',
        });
      }
      if (currentStatus === 'pending' || currentStatus === 'rejected') {
        return res.status(400).json({
          status: res.statusCode,
          error: 'The loan is not approved',
        });
      }
      const createdOn = moment().format('YYYY-MM-DD HH:mm:ss');
      const monthlyInstallment = 4; // bring back paymentInstallment of that specific loan; (work on this later)
      const amount = currentAmount; // bring back loan amount of that specific loan; (work on this later)
      const interest = amount * 0.5;
      const balance = currentBalance + 50000; //  balance = paidAmount + lastBalance; (work on this later)
      const remain = amount - balance; // remain = amount - balance; (work on this later)
      const repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
      const repayment = new Repayment(
        loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn,
      );
      const dataValues = [
        repayment.loanId,
        repayment.monthlyInstallment,
        repayment.paidAmount,
        repayment.repaid,
        repayment.balance,
        repayment.remain,
        repayment.createdOn,
      ];
      const repaidPart = await db.query(queries.insertRepayment, dataValues);
      return res.status(201).send({
        status: res.statusCode,
        data: {
          id: repaidPart.rows[0].id,
          loanId: repaidPart.rows[0].loanid,
          monthlyInstallment: repaidPart.rows[0].monthlyinstallment,
          paidAmount: repaidPart.rows[0].paidamount,
          amount,
          interest,
          repaid: repaidPart.rows[0].repaid,
          balance: repaidPart.rows[0].balance,
          remain: repaidPart.rows[0].remain,
          createdOn: repaidPart.rows[0].createdon,
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

export default RepaymentController;
