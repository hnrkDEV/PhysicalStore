const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true },
    endereco: { 
      type: String, 
      required: true },
    cep: { 
      type: String, 
      required: true },
    coordenadas: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
