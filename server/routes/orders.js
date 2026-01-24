const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrder,
    cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getMyOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, authorize('admin'), updateOrder);

router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
