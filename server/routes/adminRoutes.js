import express from 'express';
import auth from '../middleware/VerifyAuthToken';
import userController from '../controllers/userController';
import loanController from '../controllers/loanController';
import repaymentController from '../controllers/repaymentController';

const router = express.Router();

router.get('/users', auth.verifyToken, auth.verifyAdmin, userController.getAllUsers);
router.get('/users/:id', auth.verifyToken, auth.verifyAdmin, userController.getSpecificUser);
router.patch('/users/:email/verify', auth.verifyToken, auth.verifyAdmin, userController.verifyUser);
router.get('/loans', auth.verifyToken, auth.verifyAdmin, loanController.retrieveLoans);
router.get('/loans/:id', auth.verifyToken, auth.verifyAdmin, loanController.getSpecificLoan);
router.patch('/loans/:id', auth.verifyToken, auth.verifyAdmin, loanController.approveOrRejectLoan);
router.post('/loans/:id/repayment', auth.verifyToken, auth.verifyAdmin, repaymentController.createLoanRepayment);

export default router;
