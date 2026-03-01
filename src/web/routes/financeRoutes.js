import express from 'express';
import financesController from '../controllers/FinanceController.js';

const router = express.Router();

router.get('/dashboard', financesController.cashFlow);

export default router;