import Order from '../models/Order.js';
import { isConnectedToMongo } from '../config/db.js';
import { getStore, saveStore } from '../config/fallbackStore.js';

export const createOrder = async (req, res) => {
  try {
    const { customer, items, payment, firebaseUid } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.province || !customer.city || !customer.streetAddress) {
      return res.status(400).json({ success: false, message: 'Incomplete delivery address details' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    if (!payment || !payment.transactionCode) {
      return res.status(400).json({ success: false, message: 'Payment transaction reference code is required' });
    }

    // Generate unique Dhango order code: DHG-XXXXX
    const orderId = `DHG-${Math.floor(10000 + Math.random() * 90000)}`;

    // Calculate subtotal with standard price Rs. 1500 per item
    const subtotal = items.reduce((acc, item) => acc + (item.unitPrice || 1500) * (item.quantity || 1), 0);
    const deliveryFee = 0; // Promotional Free delivery in Nepal
    const totalAmount = subtotal + deliveryFee;

    const newOrderData = {
      orderId,
      firebaseUid: firebaseUid || null,
      customer,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      payment: {
        method: 'QR_TRANSFER',
        transactionCode: payment.transactionCode.trim(),
        receiptSlipUrl: payment.receiptSlipUrl || '',
        status: 'pending'
      },
      orderStatus: 'received',
      timeline: [
        {
          status: 'received',
          note: 'Order submitted with QR transfer payment slip.',
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    };

    if (isConnectedToMongo) {
      const order = await Order.create(newOrderData);
      return res.status(201).json({ success: true, data: order });
    }

    // Fallback Store
    const store = getStore();
    if (!store.orders) store.orders = [];
    store.orders.unshift(newOrderData);
    saveStore(store);

    return res.status(201).json({ success: true, data: newOrderData });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ success: false, message: 'Server error creating order' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { phone } = req.query;

    if (isConnectedToMongo) {
      const query = { orderId: orderId.toUpperCase() };
      if (phone) query['customer.phone'] = phone.trim();
      const order = await Order.findOne(query).lean();
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, data: order });
    }

    const store = getStore();
    const order = store.orders?.find(o => {
      const matchId = o.orderId.toUpperCase() === orderId.toUpperCase();
      if (!matchId) return false;
      if (phone) return o.customer.phone === phone.trim();
      return true;
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    if (isConnectedToMongo) {
      const orders = await Order.find({ firebaseUid: uid }).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const store = getStore();
    const userOrders = (store.orders || []).filter(o => o.firebaseUid === uid);
    return res.json({ success: true, count: userOrders.length, data: userOrders });
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving user orders' });
  }
};

export const getOrderInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = null;

    if (isConnectedToMongo) {
      order = await Order.findOne({ orderId: orderId.toUpperCase() }).lean();
    } else {
      const store = getStore();
      order = store.orders?.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const invoice = {
      invoiceNumber: `INV-${order.orderId}`,
      issueDate: order.createdAt,
      company: {
        name: 'Dhango Nepal',
        address: 'New Baneshwor, Kathmandu, Nepal',
        phone: '+977-9800000000',
        email: 'orders@dhangonepal.com',
        panNumber: '619284735'
      },
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      totalAmount: order.totalAmount,
      payment: order.payment,
      orderStatus: order.orderStatus
    };

    return res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error in getOrderInvoice:', error);
    res.status(500).json({ success: false, message: 'Server error generating invoice' });
  }
};
