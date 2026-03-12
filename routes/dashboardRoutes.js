const express = require('express');
const router = express.Router();

const { getAllCounts } = require('../controllers/dashboardController');

router.get('/counts', getAllCounts);

module.exports = router;