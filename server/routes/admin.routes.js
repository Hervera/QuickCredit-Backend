import express from 'express';
import userController from '../controllers/userController';
import loanController from '../controllers/loanController';
import repaymentController from '../controllers/repaymentController';

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getSpecificUser);
router.put('/users/:email/verify', userController.verifyUser);
router.get('/loans', loanController.retrieveLoans);
router.get('/loans/:id', loanController.getSpecificLoan);
router.put('/loans/:id', loanController.approveOrRejectLoan);
router.get('/loans/:id/repayments', repaymentController.loanRepaymentHistory);
router.post('/loans/:id/repayment', repaymentController.createLoanRepayment);

export default router;
