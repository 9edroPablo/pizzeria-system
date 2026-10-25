const express = require('express');
const {
  createOrder,
  getActiveOrders,
  markAsPaid,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/active', getActiveOrders);
router.patch('/:id/pay', markAsPaid);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
