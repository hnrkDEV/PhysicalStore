const express = require('express');
const storesController = require('../controllers/storesController');

const router = express.Router();

router
.route('/')
.get(storesController.getAllStores)
.post(storesController.createStore)

module.exports = router;