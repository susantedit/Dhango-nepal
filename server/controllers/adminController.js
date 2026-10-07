import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { isConnectedToMongo } from '../config/db.js';
import { getStore, saveStore } from '../config/fallbackStore.js';

export const getAdminStats = async (req, res) => {
  try {
    let orders = [];
    let inventory = [];

    if (isConnectedToMongo) {
      orders = await Order.find().lean();
      inventory = await Inventory.find().lean();
    } else {
      const store = getStore();
      orders = store.orders || [];
      inventory = store.inventory || [];
    }

    const totalOrders = orders.length;
    const pendingPayments = orders.filter(o => o.payment?.status === 'pending').length;
    const inPrinting = orders.filter(o => o.orderStatus === 'in_printing').length;
    const shipped = orders.filter(o => o.orderStatus === 'shipped').length;
    const delivered = orders.filter(o => o.orderStatus === 'delivered').length;

    const totalRevenue = orders
      .filter(o => o.payment?.status === 'verified')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const lowStockItems = inventory.filter(i => i.currentStock <= (i.lowStockThreshold || 10));

    return res.json({
      success: true,
      data: {
        totalOrders,
        pendingPayments,
        inPrinting,
        shipped,
        delivered,
        totalRevenue,
        lowStockCount: lowStockItems.length,
        lowStockItems
      }
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving admin stats' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;

    if (isConnectedToMongo) {
      const query = {};
      if (status) query.orderStatus = status;
      if (paymentStatus) query['payment.status'] = paymentStatus;
      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const store = getStore();
    let orders = store.orders || [];
    if (status) orders = orders.filter(o => o.orderStatus === status);
    if (paymentStatus) orders = orders.filter(o => o.payment?.status === paymentStatus);

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving orders' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, rejectionReason } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    if (isConnectedToMongo) {
      const order = await Order.findOne({ orderId: orderId.toUpperCase() });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.payment.status = status;
      if (status === 'verified') {
        order.payment.verifiedAt = new Date();
        order.orderStatus = 'payment_verified';
        order.timeline.push({
          status: 'payment_verified',
          note: 'QR Payment verified by admin.',
          timestamp: new Date()
        });

        // Deduct inventory for each item
        for (const item of order.items) {
          const sku = `TSHIRT-${item.color.toUpperCase().replace(/\s+/g, '')}-${item.size}`;
          await Inventory.findOneAndUpdate(
            { sku },
            { $inc: { currentStock: -item.quantity } }
          );
        }
      } else {
        order.payment.rejectionReason = rejectionReason || 'Payment receipt does not match transaction details.';
        order.timeline.push({
          status: 'payment_rejected',
          note: `Payment rejected: ${order.payment.rejectionReason}`,
          timestamp: new Date()
        });
      }

      await order.save();
      return res.json({ success: true, data: order });
    }

    // Fallback store
    const store = getStore();
    const order = store.orders?.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.payment.status = status;
    if (status === 'verified') {
      order.payment.verifiedAt = new Date();
      order.orderStatus = 'payment_verified';
      order.timeline.push({
        status: 'payment_verified',
        note: 'QR Payment verified by admin.',
        timestamp: new Date()
      });

      // Deduct stock in store
      for (const item of order.items) {
        const sku = `TSHIRT-${item.color.toUpperCase().replace(/\s+/g, '')}-${item.size}`;
        const invItem = store.inventory?.find(i => i.sku === sku);
        if (invItem) {
          invItem.currentStock = Math.max(0, invItem.currentStock - item.quantity);
        }
      }
    } else {
      order.payment.rejectionReason = rejectionReason || 'Payment receipt rejected.';
      order.timeline.push({
        status: 'payment_rejected',
        note: `Payment rejected: ${order.payment.rejectionReason}`,
        timestamp: new Date()
      });
    }

    saveStore(store);
    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    res.status(500).json({ success: false, message: 'Server error updating payment status' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const allowed = ['received', 'payment_verified', 'in_printing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (isConnectedToMongo) {
      const order = await Order.findOne({ orderId: orderId.toUpperCase() });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.orderStatus = status;
      order.timeline.push({
        status,
        note: note || `Status updated to ${status}`,
        timestamp: new Date()
      });
      await order.save();
      return res.json({ success: true, data: order });
    }

    const store = getStore();
    const order = store.orders?.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    order.timeline.push({
      status,
      note: note || `Status updated to ${status}`,
      timestamp: new Date()
    });
    saveStore(store);
    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ success: false, message: 'Server error updating order status' });
  }
};
