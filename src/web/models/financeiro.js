import pool from '../../../db/db.js';

const financeiro = async (req, res) => {

    const [rows] = await pool.query(
            ` 
                SELECT
                    servico,
                    valor,
                    pagamento,
                    data_entrada,
                    prazo
                FROM servicos_automotivos
                    ORDER BY data_entrada ASC
            `
    )

    return rows;

}

export default financeiro;
        