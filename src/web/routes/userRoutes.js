import express from 'express';
import userController from '../controllers/UserController.js';

const router = express.Router();

router.post('/cadastrar', userController.register);
router.post('/login', userController.login);
router.post('/recuperar-senha', userController.forgotPasswordToken);
router.post('/resetar-senha', userController.changeForgottenPassWord)

export default router;