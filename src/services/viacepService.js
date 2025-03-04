const axios = require("axios");

async function buscarEndereco(cep) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        
        if (response.data.erro) {
            console.log("CEP não encontrado pela API do ViaCEP!");
            return null;
        }
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar CEP:", error.message);
        return null;
    }
}

module.exports = { buscarEndereco };
