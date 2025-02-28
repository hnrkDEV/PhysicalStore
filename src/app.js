const express = require('express');
const storeRouter = require('./routes/storesRoutes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/stores', storeRouter);

app.all('*', (req,res, next) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`
    })
  });

  module.exports = app;