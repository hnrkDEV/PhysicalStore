const axios = require('axios');

async function buscarCoordenadas(endereco) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&addressdetails=1&limit=1`;

    try {
        const response = await axios.get(url);
        const data = response.data[0];

        if(!data) {
            console.log("Endereço não encontrado para realizar a geocodificação");
            return null;
        }
        return {
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon)
        };
    } catch (error) {
        console.error("Erro ao buscar coordenadas:", error.message);
        return null;
    };
};

module.exports = { buscarCoordenadas };