import express from 'express';

// Teste de db
import listarServicos from '../models/servicos.js';
import financas from '../models/financeiro.js';
import agendarServico from '../models/agendamento.js';
import editarServico from '../models/editarAgendamento.js';

const router = express.Router();


router.get('/servicos', listarServicos);
router.get('/financas', financas);
router.post('/agendar', agendarServico);
router.put('/editar/:id', editarServico);


// router.get('/', async (req, res) => {
//     try{

//         res.render('pages/home/index')

//     }catch(error){
//         res.status(500).send('Erro no servidor')
//         console.log(error)
//     }
// })

export default router;