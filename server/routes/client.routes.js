import express from 'express';
import auth from '../Middleware/VerifyAuthToken';
import loanController from '../Controllers/LoanController';
import repaymentController from '../Controllers/RepaymentController';

const router = express.Router();

router.post('/loans', auth.verifyToken, loanController.createLoan);
router.get('/loans/:id/repayments', auth.verifyToken, repaymentController.loanRepaymentHistory);

export default router;
