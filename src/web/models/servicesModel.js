import pool from '../../../db/db.js';

//Rota get

const listarServicos = async (user_id) => {
//Use sempre aspas inversas nas queries
    const id = user_id;

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
            FROM servicos  WHERE user_id = ?
            ORDER BY data_entrada ASC
        `,
        [id]
    );
    
    return rows;
}

const agendarServico = async (id, dados) => {
    const user_id = id;
    const { 
        servico, veiculo, descricao, placa,
        cliente, telefone_cliente, valor, 
        pagamento, data_entrada, prazo, situacao 
    } = dados;

    const query = `
        INSERT INTO servicos
            (user_id, servico, veiculo, descricao, placa, cliente, telefone_cliente, valor, pagamento, data_entrada, prazo, situacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    //Evitar SQL Injection

    const values = [
        user_id, servico, veiculo, descricao, placa, cliente, telefone_cliente, valor,
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

const cleanup = async () => {
  const query = `
    DELETE FROM servicos 
    WHERE situacao = 'Concluido' 
    AND data_conclusao < DATE_SUB(NOW(), INTERVAL 45 DAY)
  `
  await pool.query(query)
  return true;
}

export default { listarServicos, agendarServico, editarAgendamento, cleanup };