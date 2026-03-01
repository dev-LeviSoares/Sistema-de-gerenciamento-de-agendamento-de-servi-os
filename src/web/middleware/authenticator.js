import jwt, { decode } from 'jsonwebtoken';

const authenticator = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({ error: 'Você não tem autorização' })
    }

    const token = authHeader && authHeader.split(' ')[1]; // Se vier "Bearer TOKEN" => Separa os 2 em array e pega o token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Anexa os dados do usuario na requisicao
        next();
    } catch (error) {
        console.log("Tentativa de entrada")
        return res.status(401).json({ error: 'Token inválido ou expirado'})
    }
}

export default authenticator;