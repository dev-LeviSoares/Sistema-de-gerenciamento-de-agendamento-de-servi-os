import pool from '../../../db/db.js';

//Rota get

const listarServicos = async (req, res) => {
    try{
        //Use sempre aspas inversas nas queries
        
        const [rows] = await pool.query(
            `
                SELECT
                    id,
                    servico,
                    veiculo,
                    placa,
                    descricao,
                    cliente,
                    telefone_cliente,
                    valor,
                    pagamento,
                    data_entrada,
                    prazo,
                    situacao
                FROM servicos_automotivos
                    ORDER BY data_entrada ASC
            `
        );

        const servicos = rows.map(row => ({
            id: row.id,
            servico: row.servico,
            cliente: row.cliente,
            veiculo: row.veiculo,
            telefone: row.telefone_cliente,
            valor: row.valor,
            dataEntrada: row.data_entrada,
            //Opcionais
            placa: row.placa || null,
            descricao: row.descricao || null,
            pagamento: row.pagamento || null,
            prazo: row.prazo || null,
            situacao: row.situacao || null
        }));

        return res.status(200).json(servicos);

    } catch(error){
        console.error("Erro ao listar serviços:", error)
        res.status(500).send("Erro no servidor ao carregar informações.")
    }
}

export default listarServicos;