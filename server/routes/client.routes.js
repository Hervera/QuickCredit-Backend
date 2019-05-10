import express from 'express';
import loanController from '../controllers/loanController';


const router = express.Router();

router.post('/loans', loanController.createLoan);

export default router;
