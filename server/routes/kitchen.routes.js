const express = require('express');
const { getKitchenOrders } = require('../controllers/kitchen.controller');

const router = express.Router();

router.get('/orders', getKitchenOrders);

module.exports = router;