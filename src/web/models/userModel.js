import pool from '../../../db/db.js';

const create = async (dados) => {
  const { nome, email, senha, nome_estabelecimento, telefone } = dados;
    const query = `
      INSERT INTO usuarios ( nome, email, senha, nome_estabelecimento, telefone )
      VALUES( ?, ?, ?, ? ,?);
    `
    const values = [ nome, email, senha, nome_estabelecimento, telefone || null ];
    const [ result  ] = await pool.query(query, values);

  return { id: result.insertId, nome }; //retorna para o controller exibir 
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


const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0]; // retorna o usuário ou undefined
}

export default { create, findByEmail };