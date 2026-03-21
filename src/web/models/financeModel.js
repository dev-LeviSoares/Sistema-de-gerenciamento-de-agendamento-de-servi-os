import pool from '../../../db/db.js';

const services = async () => {

    const [rows] = await pool.query(
    ` 
        SELECT
            servico,
            valor,
            pagamento,
            data_entrada,
            prazo
        FROM servicos
            ORDER BY data_entrada ASC
    `
    )
    return rows;
}

export default { services };
        