import pool from '../../../db/db.js';

const editarServico = async (req, res) => {

    try {
        const { id } = req.params;
        const { descricao, valor, pagamento, prazo, situacao} = req.body;

        const query = `
        
            UPDATE servicos_automotivos
            SET descricao = ?,
                valor = ?,
                pagamento = ?,
                prazo = ?,
                situacao = ? 
            WHERE id = ?
        `

        const values = [descricao, valor, pagamento, prazo, situacao, id];

        const [result] = await pool.query(query, values);

        res.status(201).json({
            message: "Serviço atualizado com sucesso!"
        })
        
    } catch (error) {
        console.error("Erro ao alterar informações do banco de dados: ", error);
        res.status(500).send("Erro no servidor ao carregar informações.");
    }

}

export default editarServico;