import express from 'express';
import {
  getAdminStats,
  getAllOrders,
  verifyPayment,
  updateOrderStatus
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:orderId/payment', verifyPayment);
router.patch('/orders/:orderId/status', updateOrderStatus);

export default router;
