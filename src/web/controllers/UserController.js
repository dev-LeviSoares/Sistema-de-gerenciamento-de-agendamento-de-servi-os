import userService from '../../services/userService.js';

const register = async (req, res) => {
    try {     
        const user = await userService.registerUser(req.body);
        
        return res.status(201).json({ message: 'Usuario cadastrado com sucesso!', id: user.id, nome: user.nome }) // o model retorna o id e nome

    } catch (error) {
        res.status(400).json({ error: error.message});
    }

}

const login = async (req, res) => {
    try {
        const { token, user } = await userService.loginUser(req.body);
        return res.status(200).json({ token, user });
    } catch(error){
        return res.status(400).json({error: error.message})
    }
}

const forgotPassword = async (req, res) => {
    try {
        const userForgot = await userService.forgotPasswordUser(req.body)

        return res.status(200).json({message: "Seu token de recuperacao de senha", userForgot: userForgot.token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export default { register, login, forgotPassword }