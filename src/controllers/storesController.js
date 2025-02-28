const Store = require('../models/storeModel');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find();
        
        res.status(200).json({
            status: 'success',
            results: stores.length,
            data: {
                stores
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.createStore = async (req, res) => {
    try {
        console.log(req.body); 
        const { name, endereco, cep, coordenadas } = req.body;

        if (!name || !endereco || !cep || !coordenadas || typeof coordenadas.latitude !== 'number' || typeof coordenadas.longitude !== 'number') {
            return res.status(400).json({ status: "fail", message: "Dados inválidos. Verifique os campos enviados." });
        }

        const novaLoja = await Store.create({ name, endereco, cep, coordenadas });

        res.status(201).json({
            status: "success",
            data: {
                store: novaLoja
            }
        });

    } catch (error) {
        console.error("Erro ao criar loja:", error);
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};
