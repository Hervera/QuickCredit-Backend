import Joi from 'joi';
import mock from '../data/mock';
import validate from '../helpers/validation';

const loans = {

  loans(req, res) {
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
        error: 'There is no Repayment History for that loan',
      });
    }
  },

};


export default loans;
