const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//! Demande de Co2.

const co2Routes = require('./routes/co2Routes');

//! -------------------------------------------------

const app = express();

//! Header pour les Cross Origine.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

//! -------------------------------------------------

//! Middleware bodyParser.
app.use(bodyParser.json());
//! -------------------------------------------------

//! Co2.
app.use('/api/getCo2Routes', co2Routes);
//! -------------------------------------------------

module.exports = app;
