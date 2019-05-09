import mock from '../data/mock';

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

};

export default loans;
