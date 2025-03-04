const { buscarEndereco } = require("../services/viacepService");
const { calcularDistancia } = require("../services/distanceService");
const { buscarCoordenadas } = require("../services/geocodingService");
const Store = require('../models/storeModel');

exports.PegarTodasLojas = async (req, res) => {
    try {
        const lojas = await Store.find();
        res.status(200).json({
            status: 'success',
            results: lojas.length,
            data: {
                lojas
            }
        });
    } catch (error) {
        console.error("Erro ao buscar lojas:", error.message);
        res.status(500).json({
            status: 'fail', 
            message: error.message
        });
    }
};

exports.CriarLoja = async (req, res) => {
    try {
        const { name, endereco, cep, coordenadas } = req.body;

        const latitude = Number(coordenadas?.latitude);
        const longitude = Number(coordenadas?.longitude);

        if (!name || !endereco || !cep || isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ status: "fail", message: "Dados inválidos. Verifique os campos enviados." });
        }

        const novaLoja = await Store.create({ name, endereco, cep, coordenadas: { latitude, longitude } });

        res.status(201).json({
            status: "success",
            data: {
                store: novaLoja
            }
        });

    } catch (error) {
        console.error("Erro ao criar loja:", error.message, error.stack);
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

exports.localizarLojas = async (req, res) => {
    const { cep } = req.params;

    try {
        const endereco = await buscarEndereco(cep);

        if (!endereco) {
            console.warn(`CEP ${cep} não encontrado.`);
            return res.status(400).json({ 
                status: "fail", 
                message: "CEP inválido ou não encontrado." 
            });
        }

        const userLocation = await buscarCoordenadas(endereco.logradouro, endereco.localidade, endereco.uf);

        if (!userLocation) {
            console.error("Falha ao obter coordenadas.");
            return res.status(500).json({ 
                status: "fail", 
                message: "Erro ao obter coordenadas do endereço." 
            });
        }

        const lojas = await Store.find();

        const lojasComDistancia = await Promise.all(lojas.map(async loja => {
            try {
                const distancia = await calcularDistancia(
                    [userLocation.longitude, userLocation.latitude],
                    [loja.coordenadas.longitude, loja.coordenadas.latitude]
                );
                return { ...loja._doc, distancia };
            } catch (error) {
                console.error("Erro ao calcular distância para a loja:", loja.name, error.message);
                return null;
            }
        }));

        const lojasProximas = lojasComDistancia
            .filter(loja => loja?.distancia <= 100)
            .sort((a, b) => a.distancia - b.distancia);

        if (lojasProximas.length === 0) {
            return res.status(404).json({ 
                status: "fail", 
                message: 'Nenhuma loja encontrada em um raio de 100 km.' 
            });
        }

        res.status(200).json({
            status: "success",
            results: lojasProximas.length,
            data: lojasProximas
        });

    } catch (error) {
        res.status(500).json({ 
            status: "fail", 
            message: 'Erro interno do servidor' 
        });
    }
};