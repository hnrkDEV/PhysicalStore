const axios = require('axios');
const ORS_API_KEY = "5b3ce3597851110001cf624800cb4f67da4646f1be074571e613bd9b";

async function calcularDistancia(coordsOrigem, coordsDestino) {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

    try {
        const response = await axios.post(url, {
            coordinates: [coordsOrigem, coordsDestino],
            format: 'json'
        }, {
            headers: {
                'Authorization': ORS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const distancia = response.data.routes[0].summary.distance / 1000;
        return distancia;

    } catch (error) {
        console.error('Erro ao calcular a distância:', error.response?.data || error.message);
        return null;
    }
}

module.exports = { calcularDistancia };
