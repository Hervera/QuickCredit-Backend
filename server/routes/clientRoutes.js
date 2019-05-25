import express from 'express';
import auth from '../middleware/VerifyAuthToken';
import loanController from '../controllers/loanController';
import repaymentController from '../controllers/repaymentController';

const router = express.Router();

router.post('/loans', auth.verifyToken, auth.verifyClient, loanController.createLoan);
router.get('/loans/:id/repayments', auth.verifyToken, repaymentController.loanRepaymentHistory);

export default router;
