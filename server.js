const path = require('path');
const co2Controllers = require('./controllers/co2Controllers');
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
  // console.log('Sever : numSalle : ', numSalle);

  let co2 = await co2Controllers.getCo2(req.params.numSalle);

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
