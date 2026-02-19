import pool from '../../../db/db.js';

const editarServico = async (req, res) => {

    try {
        const { id } = req.params;
        const { descricao, valor, pagamento, prazo, situacao} = req.body;

        const fields = [];
        const values = []; // Para evitar SQL Injection

        if (descricao !== undefined){
            fields.push("descricao = ?");
            values.push(descricao);
        }

        if (valor !== undefined) {
            fields.push("valor = ?");
            values.push(valor);
        }

        if (pagamento !== undefined) {
            fields.push("pagamento = ?");
            values.push(pagamento);
        }

        if(prazo !== undefined) {
            fields.push("prazo = ?");
            values.push(prazo);
        }

        if(situacao !== undefined) {
            fields.push("situacao = ?");
            values.push(situacao)
        }

        if(fields.length === 0) {
            return res.status(400).json({ message: "Nenhum campo enviado para atualização."});
        }

        const query = `
            UPDATE servicos_automotivos
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

        values.push(id);

        await pool.query(query, values);

        res.status(201).json({
            message: "Serviço atualizado com sucesso!"
        })

    } catch (error) {
        console.error("Erro ao alterar informações do banco de dados: ", error);
        res.status(500).send("Erro no servidor ao carregar informações.");
    }

}

export default editarServico;