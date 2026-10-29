const express = require('express');
const { getHistory, getWaitTime, getOrderById } = require('../controllers/orderReports.controller');

const router = express.Router();

router.get('/history', getHistory);
router.get('/wait-time', getWaitTime);
// IMPORTANTE: debe ir después de /history y /wait-time, si no los intercepta como si fueran un id
router.get('/:id', getOrderById);

module.exports = router;