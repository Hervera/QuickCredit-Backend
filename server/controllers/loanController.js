import Joi from 'joi';
import mock from '../data/mock';
import validate from '../helpers/validation';

const loans = {

  allLoans(req, res) {
    if (mock.loans.length === 0) {
      res.status(404).json({
        status: 404,
        error: 'No loan found',
      });
    } else {
      res.status(200).json({
        status: 200,
        data: mock.loans,
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

};

export default loans;
