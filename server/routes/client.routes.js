import express from 'express';
import auth from '../middleware/auth.middleware';
import loanController from '../controllers/loanController';


const router = express.Router();

router.post('/loans', auth.verifyToken, loanController.createLoan);

export default router;
