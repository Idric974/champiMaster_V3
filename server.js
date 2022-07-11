const path = require('path');
const co2Controllers = require('./controllers/co2Controllers3');
const express = require('express');
const app = express();
const vert = '\u001b[1;32m';
const router = express.Router();
const port = 5000;

app.use(function (req, res, next) {
  req.setTimeout(0);
  next();
});

app.use('/', router);

app.get('/getCo2/:numSalle', async (req, res) => {
  let numSalle = req.params.numSalle;

  let co2 = await co2Controllers.getCo2(numSalle);
  // console.log('Taux de Co2 =========> :', co2);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(co2));
});

app.listen(port, () => {
  console.log(
    vert,
    '[ SERVER          ] Le serveur de la master tourne sur le ' + port
  );
});
