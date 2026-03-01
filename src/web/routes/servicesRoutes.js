import express from 'express';
import servicesController from '../controllers/ServicesController.js';
import { resolveMx } from 'dns';

const router = express.Router();

router.get('/listar', servicesController.listarServicos);
router.post('/agendar', servicesController.agendarServico);
router.patch('/editar/:id', servicesController.editarAgendamento);
// router.delete('/apagar/:id');

export default router;