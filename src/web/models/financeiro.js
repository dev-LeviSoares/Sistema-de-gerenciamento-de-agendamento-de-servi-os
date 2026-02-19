import pool from '../../../db/db.js';

//Rota get

const financas = async (req, res) => {
    
    try{
        //Use sempre aspas inversas nas queries

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

        const financeiro = rows.map(row => ({
            servico: row.servico,
            valor: row.valor,
            pagamento: row.pagamento || null,
            data_entrada: row.data_entrada,
            prazo: row.prazo || null
        }))

        return res.status(200).json(financeiro);


    } catch(error){
        console.error("Erro ao listar as informações do banco de dados:", error)
        res.status(500).send("Erro no servidor ao carregar as informações.")
    }
}

export default financas
        