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

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0]; // retorna o usuário ou undefined
}

const createForgotToken = async (recovery) => {
  const { userId, token, expires } = recovery;
  const query = `
    UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE id = ?;
  `
  const values = [ token, expires, userId ];
  
  await pool.query(query, values);

  return { token }
}

const authTokenPassword = async (token) => {
  const rows = await pool.query(
    'SELECT * FROM usuarios WHERE reset_token = ?',
    [token]
  );
  return rows[0];
}

const resetPassword = async (data) => {
  const { token, password } = data

  const query = `
    UPDATE usuarios SET senha = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ? 
  `
  const values = [password, token];

  await pool.query(query, values);

  return true;
}

export default { create, findByEmail, authTokenPassword, createForgotToken, resetPassword};