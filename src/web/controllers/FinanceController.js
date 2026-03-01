import financeService from '../../services/financeService.js';

const cashFlow = async (req, res) => {

    try {
        const accouting = await financeService.finance()
        console.log(accouting)
        return res.status(200).json(accouting);

    } catch (error) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).send("Erro no servidor ao carregar informações.");
    } 
}

export default { cashFlow };