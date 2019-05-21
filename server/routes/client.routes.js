import express from 'express';
import auth from '../Middleware/VerifyAuthToken';
import loanController from '../Controllers/LoanController';


const router = express.Router();

router.post('/loans', auth.verifyToken, loanController.createLoan);

export default router;
