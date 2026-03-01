import servicesModel from '../web/models/servicesModel.js';
import cron from 'node-cron';
// 0 6 * * 1
cron.schedule('* * * * *', async() => {
    console.log('Cron iniciado — verificando existe servicos com mais de 30 dias ...');
    await servicesModel.cleanup();
    console.log('Cron finalizado — verificacao de servicos concluida...');
});

//Nao ha necessidade de exportacao