import pool from '../../../db/db.js';

//Rota get

const listarServicos = async ( ) => {
        
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
            FROM servicos
                ORDER BY data_entrada ASC
        `
    );
    
    return rows;
}

const agendarServico = async (dados) => {

    const { 
        servico, veiculo, descricao, placa,
        cliente, telefone_cliente, valor, 
        pagamento, data_entrada, prazo, situacao 
    } = dados;

    const query = `
        INSERT INTO servicos
            (servico, veiculo, descricao, placa, cliente, telefone_cliente, valor, pagamento, data_entrada, prazo, situacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    //Evitar SQL Injection

    const values = [
        servico, veiculo, descricao, placa, cliente, telefone_cliente, valor,
        pagamento, data_entrada, prazo, situacao
    ];

    await pool.query(query, values);
}

const editarAgendamento = async (id, dados) => {
    const { descricao, valor, pagamento, prazo, situacao } = dados;

    const fields = [];
    const values = [];

    if (descricao !== undefined) {
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

    if (prazo !== undefined) {
        fields.push("prazo = ?");
        values.push(prazo);
    }

    if (situacao !== undefined) {
        fields.push("situacao = ?");
        values.push(situacao);
    }

    // Retorna false se nenhum campo foi enviado
    if (fields.length === 0) {
        return false;
    }

    const query = `
        UPDATE servicos
        SET ${fields.join(", ")}
        WHERE id = ?
    `;

    values.push(id);

    await pool.query(query, values);

    return true;
}

export default { listarServicos, agendarServico, editarAgendamento };