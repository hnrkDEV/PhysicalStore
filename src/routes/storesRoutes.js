const express = require('express');
const storesController = require('../controllers/storesController');

const router = express.Router();

router
.route('/')
.get(storesController.PegarTodasLojas)
.post(storesController.CriarLoja)

router
.route("/buscar/:cep")
.get(storesController.localizarLojas);


module.exports = router;