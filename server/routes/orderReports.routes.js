const express = require('express');
const { getHistory, getWaitTime } = require('../controllers/orderReports.controller');

const router = express.Router();

router.get('/history', getHistory);
router.get('/wait-time', getWaitTime);

module.exports = router;