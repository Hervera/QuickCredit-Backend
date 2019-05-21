import express from 'express';
import auth from '../middleware/VerifyAuthToken';
import loanController from '../controllers/LoanController';
import repaymentController from '../controllers/RepaymentController';

const router = express.Router();

router.post('/loans', auth.verifyToken, loanController.createLoan);
router.get('/loans/:id/repayments', auth.verifyToken, repaymentController.loanRepaymentHistory);

export default router;
