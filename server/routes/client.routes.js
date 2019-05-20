import express from 'express';
import auth from '../middleware/VerifyAuthToken';
import loanController from '../controllers/LoanController';


const router = express.Router();

router.post('/loans', auth.verifyToken, loanController.createLoan);

export default router;
