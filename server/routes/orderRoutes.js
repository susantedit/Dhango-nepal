import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getOrderInvoice
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/track/:orderId', getOrderById);
router.get('/user/:uid', getUserOrders);
router.get('/:orderId/invoice', getOrderInvoice);

export default router;
