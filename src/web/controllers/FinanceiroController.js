import Finance from '../models/financeiro';

const financeiro = async (req, res) => {

    try {

        const rows = await Finance.financeiro();

        const financas = rows.map(row => ({

            servico: row.servico,
            valor: row.valor,
            data_entrada: row.data_entrada,
            pagamento: row.pagamento || null,
            prazo: row.prazo || null

        }));

        return res.status(200).json(financeiro);

    } catch (error) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).send("Erro no servidor ao carregar informações.");
    }
    


}