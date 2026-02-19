import pool from '../../../db/db.js';

//Rota post

const agendarServico = async (req, res) => {

    try {

        const { 
                servico, veiculo, descricao, placa,
                cliente, telefone_cliente, valor, 
                pagamento, data_entrada, prazo, situacao 
            } = req.body;

        const query = `
            INSERT INTO servicos_automotivos 
                (servico, veiculo, descricao, placa, cliente, telefone_cliente, valor, pagamento, data_entrada, prazo, situacao) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        //Evitar SQL Injection

        const values = [
            servico, veiculo, descricao, placa, cliente, telefone_cliente, valor,
            pagamento, data_entrada, prazo, situacao
        ];

        await pool.query(query, values);
 
        res.status(201).json({
            message: "Serviço cadastrado com sucesso!",
        })
        
    } catch (error) {
        console.error("Erro ao agendar o serviço: ", error);
        res.status(500).send("Erro no servidor ao agendar seu serviço!");
    }
}

export default agendarServico;