const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => console.log('DB Conectado'))
  .catch(err => console.error('Erro ao conectar no DB:', err));

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App runing on port ${port}...`);
  });