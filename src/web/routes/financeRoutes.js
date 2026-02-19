import express from 'express';

import financesController from '../controllers/FinanceiroController.js';

const router = express.Router();

router.get('/', (req, res) => {

    res.render("")

});

router.get('/dashboard', financesController.financeiro);

export default router;