import financeModel from '../web/models/financeModel.js';

const finance = async () => {
    const rows = await financeModel.services ();

    const accounting = rows.map(row => ({
        servico: row.servico,
        valor: row.valor,
        data_entrada: row.data_entrada,
        pagamento: row.pagamento || 'Sem esse dado',
        prazo: row.prazo || 'Sem esse dado'
    }));

    return { accounting };
}

export default { finance };