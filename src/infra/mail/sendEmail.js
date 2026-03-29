import transporter from "./nodeMailer.js";

const sendRecoveryLink = async (email, token) => {
    console.log(`Email dentro do sendRecoveryLink ${email}`)
    try {
        await transporter.sendMail({
            from: `Sistema de gereciamento de serviços <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: `Email para recuperação de senha.`,
            html: `
                <h1 style="font-family: Arial, Helvetica, sans-serif;"> Email para recuperação de senha! <h1>
                <h3 style="font-family: Arial, Helvetica, sans-serif;"> Esse email foi enviado para 
                recuperação da sua senha. Caso não seja você, apenas ignore o email! </h3>
                <a href="http://localhost:3000/login/resetar-senha?token=${token}" target="_blank" rel="noopener noreferrer">Link para redefinir</a>
                <h3 style="font-family: Arial, Helvetica, sans-serif;"> Copia o link e joga no postman </h3>
            `
        })
        
        return "Email enviado com sucesso"
   
    } catch (error) {
        throw new Error("Erro ao enviar email:", error);
    }
}

export default { sendRecoveryLink };