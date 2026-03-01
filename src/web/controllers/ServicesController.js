import ServicesModel from '../models/servicesModel.js';

const listarServicos = async (req, res) => {

    try {
        // Chama o model para buscar os dados do banco
        const rows = await ServicesModel.listarServicos();

        // Formata os dados antes de enviar para o cliente
        
        const servicos = rows.map(row => ({
            id: row.id,
            servico: row.servico,
            cliente: row.cliente,
            veiculo: row.veiculo,
            telefone: row.telefone_cliente,
            valor: row.valor,
            dataEntrada: row.data_entrada,
            //Opcionais
            placa: row.placa || null,
            descricao: row.descricao || null,
            pagamento: row.pagamento || null,
            prazo: row.prazo || null,
            situacao: row.situacao || null
        }));

        return res.status(200).json(servicos);

    } catch (error) {
        console.error("Erro ao listar serviços:", error);
        res.status(500).send("Erro no servidor ao carregar informações.");
    }
}

const agendarServico = async (req, res) => {

    try {
        
        await ServicesModel.agendarServico(req.body);

        return res.status(201).json({
            message: "Serviço cadastrado com sucesso! "
        })

    } catch (error) {
        console.error("Erro ao agendar o serviço: ", error);
        res.status(500).send("Erro no servidor ao agendar seu serviço!");
    }
}

const editarAgendamento = async (req, res) => {
    
    try {
        
        const { id } = req.params;

        const atualizado = await ServicesModel.editarAgendamento(id, req.body);

        if (!atualizado) {
            return res.status(400).json({ message: "Nenhum campo enviado para atualização." });
        }
    
        return res.status(200).json({ message: "Serviço atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro ao alterar informações do banco de dados: ", error);
        res.status(500).send("Erro no servidor ao carregar informações.");
    }
}

export default { listarServicos, agendarServico, editarAgendamento }