import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

router.post('/signup', authController.register);
router.post('/signin', authController.login);

export default router;
