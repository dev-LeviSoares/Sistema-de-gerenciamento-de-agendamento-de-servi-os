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

const forgotPasswordToken = async (req, res) => {
    try {

       await userService.forgotPasswordUser(req.body)
        
        return res.status(200).json({message: "Email de recuperação de senha enviado"});

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changeForgottenPassWord = async(req, res) => {
    try {
        await userService.newPassword({token: req.query.token, password: req.body.password});

        return res.status(200).json({message: "Senha alterada com sucesso!"})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export default { register, login, forgotPasswordToken, changeForgottenPassWord }