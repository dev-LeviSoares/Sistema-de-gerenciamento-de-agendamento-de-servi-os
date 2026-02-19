import express from 'express';

import servicosController from '../controllers/servicosController.js';
import { resolveMx } from 'dns';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('')
})

router.get('/', servicosController.listarServicos);
router.post('/servicos/agendar', servicosController.agendarServico);
router.patch('/editar/:id', servicosController.editarAgendamento);

export default router;