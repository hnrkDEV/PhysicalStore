const { buscarEndereco } = require("../services/viacepService");
const { calcularDistancia } = require("../services/distanceService");
const { buscarCoordenadas } = require("../services/geocodingService");
const logger = require('../utils/logger');
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
        const { nome, endereco, cep, coordenadas } = req.body;

        const latitude = Number(coordenadas?.latitude);
        const longitude = Number(coordenadas?.longitude);

        if (!nome || !endereco || !cep || !coordenadas) {
            logger.warn('Dados inválidos ao criar loja', { requestBody: req.body });
            return res.status(400).json({ status: "fail", message: "Dados inválidos. Verifique os campos enviados." });
        }

        const novaLoja = await Store.create({ nome, endereco, cep, coordenadas: { latitude, longitude } });

        logger.info('Loja criada com sucesso', { loja: novaLoja });
        res.status(201).json({ status: "success", data: { store: novaLoja } });

    } catch (error) {
        logger.error('Erro ao criar loja', { error: error.message, stack: error.stack });
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.localizarLojas = async (req, res) => {
    const { cep } = req.params;

    try {
        const endereco = await buscarEndereco(cep);

        if (!endereco) {
            logger.warn(`CEP inválido ou não encontrado: ${cep}`);
            return res.status(400).json({ 
                status: "fail", 
                message: "CEP inválido ou não encontrado." 
            });
        }

        const userLocation = await buscarCoordenadas(endereco.logradouro, endereco.localidade, endereco.uf);

        if (!userLocation) {
            logger.warn(`Não foi possível obter as coordenadas para o endereço do CEP: ${cep}`);
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
            logger.info(`Nenhuma loja encontrada em um raio de 100 km para o CEP: ${cep}`);
            return res.status(404).json({ 
                status: "fail", 
                message: 'Nenhuma loja encontrada em um raio de 100 km.' 
            });
        }

        logger.info(`Lojas encontradas para o CEP ${cep}: ${lojasProximas.length} lojas`, {
            cep,
            lojasEncontradas: lojasProximas.map(loja => loja.nome)
        });

        res.json(lojasProximas);

    } catch (error) {
        logger.error('Erro ao localizar lojas', { cep, error: error.message });
        res.status(500).json({ 
            status: "fail", 
            message: 'Erro interno do servidor' 
        });
    }
};