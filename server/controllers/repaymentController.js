import Joi from 'joi';
import moment from 'moment';
import Repayment from '../models/Repayment';
import validate from '../helpers/validation';
import db from '../data/connection';
import queries from '../data/queries';


class RepaymentController {
  static async loanRepaymentHistory(req, res) {
    try {
      const loanid = Number(req.params.id);
      const { error } = Joi.validate(
        {
          loanid,
        },
        validate.loanidParams,
      );
      if (error) {
        return res.status(400).json({
          status: res.statusCode,
          error: error.details[0].message,
        });
      }
      const repaymentHistory = await db.query(queries.repaymentHistory, [loanid]);
      if (repaymentHistory.rows.length === 0) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'There is no repayment history for that loan',
        });
      }
      return res.status(200).json({
        status: res.statusCode,
        data: repaymentHistory.rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${error}`,
      });
    }
  }

  static async createLoanRepayment(req, res) {
    try {
      const loanid = parseInt(req.params.id, 10);
      const { paidamount } = req.body;
      const { error } = Joi.validate({ loanid, paidamount }, validate.repaymentSchema);
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
      const createdon = moment().format('YYYY-MM-DD HH:mm:ss');
      const monthlyInstallment = 4; // bring back paymentinstallment of that specific loan; (work on this later)
      const amount = currentAmount; // bring back loan amount of that specific loan; (work on this later)
      const interest = amount * 0.5;
      const balance = currentBalance + 50000; //  balance = paidamount + lastBalance; (work on this later)
      const remain = amount - balance; // remain = amount - balance; (work on this later)
      const repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
      const repayment = new Repayment(
        loanid, monthlyInstallment, paidamount, repaid, balance, remain, createdon,
      );
      const dataValues = [
        repayment.loanid,
        repayment.monthlyInstallment,
        repayment.paidamount,
        repayment.repaid,
        repayment.balance,
        repayment.remain,
        repayment.createdon,
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
