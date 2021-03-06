const express = require('express');
const router = express.Router();
const co2Ctrl = require('../controllers/co2Controllers2');

//! Routes GET.
router.post('/getCo2', co2Ctrl.getCo2);
router.get('/getCo2/:numSalle', co2Ctrl.getCo2);

//! -------------------------------------------------

module.exports = router;
