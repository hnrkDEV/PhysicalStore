const express = require('express');
const storeRouter = require('./routes/storesRoutes');
const app = express();

app.use(express.json());

app.use('/api/lojas', storeRouter);

app.all('*', (req,res, next) => {
    res.status(404).json({
      status: 'fail',
      message: `Não foi possível encontrar ${req.originalUrl}!`
    })
  });

  module.exports = app;