const mongoose = require("mongoose");
const Store = require("../models/storeModel");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "../../config.env");
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error("Erro ao carregar o arquivo .env:", envResult.error);
  process.exit(1);
}


if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error("Erro nas Variáveis de ambiente não carregadas.");
  process.exit(1);
}


const filePath = path.join(__dirname, "store.json");


const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => {
    console.log("Conectado ao DB");

    const lojas = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return Store.insertMany(lojas);
  })
  .then(() => {
    console.log("✅ Lojas cadastradas com sucesso!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Erro:", err);
    mongoose.connection.close();
  });
