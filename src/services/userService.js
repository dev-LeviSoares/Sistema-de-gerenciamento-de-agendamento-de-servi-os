import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import userModel from '../web/models/userModel.js';

const registerUser = async ({ nome, email, senha, nome_estabelecimento, telefone, }) => {
    if(!nome || !email || !senha || !nome_estabelecimento) throw new Error('Digite as informações obrigatórias');
    
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) throw new Error('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(senha, 10); // Salt = sal = pitada a mais na senha

    return userModel.create({ nome, email, senha: hashedPassword, nome_estabelecimento, telefone });
}

const loginUser = async ({ email, senha}) => {
    if(!email || !senha) throw new Error('Digite os dados corretos');
    
    const user = await userModel.findByEmail(email); // Consegue acessar todas as colunas da tabela dessa funcao
    if(!user) throw new Error('Email ou senha inválidos');
    
    const checkPassword = await bcrypt.compare(senha, user.senha);
    if(!checkPassword) throw new Error('Email ou senha inválidos');

    const token = jwt.sign(
        { id: user.id, nome: user.nome, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return { token, user: { id: user.id, nome: user.nome, email: user.email } };
}

const forgotPasswordUser = async ({email}) => {
    if(!email) throw new Error('Digite o email');

    const user = await userModel.findByEmail(email);

    if(!user) throw new Error('Email inválido');
    
    const userId = user.id;
    const token = crypto.randomBytes(32).toString('hex');
    console.log(token)
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    console.log(expires)

    return await userModel.createForgotToken({userId, token, expires});

}

export default { registerUser, loginUser, forgotPasswordUser};