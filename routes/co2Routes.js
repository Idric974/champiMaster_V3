const express = require('express');
const router = express.Router();
const co2Ctrl = require('../controllers/co2Controllers');

//! Routes GET.

router.post('/getCo2', co2Ctrl.getCo2);

//! -------------------------------------------------

module.exports = router;
