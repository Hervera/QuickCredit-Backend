import express from 'express';
import userController from '../controllers/userController';
import loanController from '../controllers/loanController';


const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getSpecificUser);
router.put('/users/:email/verify', userController.verifyUser);
router.get('/loans', loanController.loans);
router.get('/loans/:id', loanController.getSpecificLoan);
router.get('/loans/:id/repayments', loanController.loanRepaymentHistory);


export default router;
