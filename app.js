//Import utilitários
import 'dotenv/config.js' // Importa e configura o dontenv
import express from 'express';
import pool from './db/db.js'; // Banco de dados
import path from 'path'; // Utilitário para trabalhar com caminhos de arquivo

// Middlewares

import auth from './src/web/middleware/authenticator.js'; // Libera rotas para usuarios clientes(autorizados)

// Jobs

import './src/jobs/cleanUpJob.js'; // O cron se registra automaticamento quando importado, ele já está executando

//Import de rotas

import homeRoutes from './src/web/routes/homeRoutes.js';
import servicesRoutes from './src/web/routes/servicesRoutes.js';
import financeRoutes from './src/web/routes/financeRoutes.js';
import userRoutes from './src/web/routes/userRoutes.js';

// Configurar __dirname em ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'web', 'views')); 
// O views[0] é a referência da pasta para achar arquivos estáticos ou views em todo o porjeto.
// O src, webm, views, é o diretorio da pasta onde estão as views

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // Faz o parse do JSON enviado no body

//Rotas de acesso a plataforma

app.use('/', homeRoutes); // Pagina principal
app.use('/login', userRoutes);
app.use('/servicos', auth, servicesRoutes);
app.use('/financeiro', auth, financeRoutes);

try{
    const PORT = process.env.PORT || 3000
    app.listen( PORT, () => console.log('Servidor rodando na porta: ', PORT))
} catch(error){
    console.error('Erro ao inicializar o aplicativo:', error)
    process.exit(1)
}

