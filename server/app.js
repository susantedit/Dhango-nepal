import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

import { getStore, saveStore } from './config/fallbackStore.js';
import { initialProducts, generateInitialInventory } from './data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Initialize Store with seed products and inventory if empty
const initStore = () => {
  const store = getStore();
  if (!store.products || store.products.length === 0) {
    store.products = initialProducts;
  }
  if (!store.inventory || store.inventory.length === 0) {
    store.inventory = generateInitialInventory();
  }
  if (!store.orders) {
    store.orders = [];
  }
  saveStore(store);
  return store;
};

initStore();

// Ensure upload directories
const uploadsDir = path.join(__dirname, 'uploads');
const artworksDir = path.join(uploadsDir, 'artworks');
const receiptsDir = path.join(uploadsDir, 'receipts');
[uploadsDir, artworksDir, receiptsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper: send JSON response with CORS
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

// Helper: read body JSON
const readBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

// Helper: parse multipart file upload
const handleFileUpload = (req, targetDir, prefix) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const filename = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.png`;
      const filePath = path.join(targetDir, filename);

      // Extract binary payload if multipart or write directly
      const boundaryMatch = req.headers['content-type']?.match(/boundary=(.+)$/);
      if (boundaryMatch) {
        const boundary = boundaryMatch[1];
        const parts = buffer.toString('binary').split('--' + boundary);
        for (const part of parts) {
          if (part.includes('filename="')) {
            const fileData = part.split('\r\n\r\n')[1]?.replace(/\r\n$/, '');
            if (fileData) {
              fs.writeFileSync(filePath, Buffer.from(fileData, 'binary'));
              return resolve(`/uploads/${path.basename(targetDir)}/${filename}`);
            }
          }
        }
      }
      // Direct binary fallback
      fs.writeFileSync(filePath, buffer);
      resolve(`/uploads/${path.basename(targetDir)}/${filename}`);
    });
    req.on('error', reject);
  });
};

const server = http.createServer(async (req, res) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);

  // Serve static uploads
  if (pathname.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      return fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }
  }

  // Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'online',
      brand: 'Dhango Nepal',
      service: 'Custom T-Shirt E-Commerce & Virtual Try-On API',
      time: new Date().toISOString()
    });
  }

  // GET /api/products
  if (pathname === '/api/products' && req.method === 'GET') {
    const store = getStore();
    return sendJson(res, 200, { success: true, count: store.products.length, data: store.products });
  }

  // GET /api/products/:slug
  if (pathname.startsWith('/api/products/') && req.method === 'GET') {
    const slug = pathname.replace('/api/products/', '');
    const store = getStore();
    const product = store.products?.find(p => p.slug === slug || p.id === slug);
    if (!product) return sendJson(res, 404, { success: false, message: 'Product not found' });
    return sendJson(res, 200, { success: true, data: product });
  }

  // GET /api/inventory
  if (pathname === '/api/inventory' && req.method === 'GET') {
    const store = getStore();
    return sendJson(res, 200, { success: true, count: store.inventory.length, data: store.inventory });
  }

  // POST /api/inventory/update
  if (pathname === '/api/inventory/update' && req.method === 'POST') {
    const body = await readBody(req);
    const store = getStore();
    const item = store.inventory?.find(i => i.sku === body.sku);
    if (!item) return sendJson(res, 404, { success: false, message: 'Inventory SKU not found' });
    item.currentStock = Math.max(0, parseInt(body.currentStock, 10));
    saveStore(store);
    return sendJson(res, 200, { success: true, data: item });
  }

  // POST /api/orders
  if (pathname === '/api/orders' && req.method === 'POST') {
    const body = await readBody(req);
    const orderId = `DHG-${Math.floor(10000 + Math.random() * 90000)}`;
    const items = body.items || [];
    const subtotal = items.reduce((acc, it) => acc + (it.unitPrice || 1500) * (it.quantity || 1), 0);
    const totalAmount = subtotal;

    const newOrder = {
      orderId,
      firebaseUid: body.firebaseUid || null,
      customer: body.customer || {},
      items,
      subtotal,
      deliveryFee: 0,
      totalAmount,
      payment: {
        method: 'QR_TRANSFER',
        transactionCode: body.payment?.transactionCode || '',
        receiptSlipUrl: body.payment?.receiptSlipUrl || '',
        status: 'pending'
      },
      orderStatus: 'received',
      timeline: [
        {
          status: 'received',
          note: 'Order submitted with QR transfer payment slip.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    const store = getStore();
    if (!store.orders) store.orders = [];
    store.orders.unshift(newOrder);
    saveStore(store);

    return sendJson(res, 201, { success: true, data: newOrder });
  }

  // GET /api/orders/track/:orderId
  if (pathname.startsWith('/api/orders/track/') && req.method === 'GET') {
    const orderId = pathname.replace('/api/orders/track/', '').toUpperCase();
    const store = getStore();
    const order = store.orders?.find(o => o.orderId.toUpperCase() === orderId);
    if (!order) return sendJson(res, 404, { success: false, message: 'Order not found' });
    return sendJson(res, 200, { success: true, data: order });
  }

  // GET /api/orders/:orderId/invoice
  if (pathname.includes('/invoice') && req.method === 'GET') {
    const match = pathname.match(/\/api\/orders\/(.+)\/invoice/);
    if (match) {
      const orderId = match[1].toUpperCase();
      const store = getStore();
      const order = store.orders?.find(o => o.orderId.toUpperCase() === orderId);
      if (!order) return sendJson(res, 404, { success: false, message: 'Order not found' });

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
      return sendJson(res, 200, { success: true, data: invoice });
    }
  }

  // GET /api/admin/stats
  if (pathname === '/api/admin/stats' && req.method === 'GET') {
    const store = getStore();
    const orders = store.orders || [];
    const inventory = store.inventory || [];

    const totalOrders = orders.length;
    const pendingPayments = orders.filter(o => o.payment?.status === 'pending').length;
    const inPrinting = orders.filter(o => o.orderStatus === 'in_printing').length;
    const shipped = orders.filter(o => o.orderStatus === 'shipped').length;
    const delivered = orders.filter(o => o.orderStatus === 'delivered').length;

    const totalRevenue = orders
      .filter(o => o.payment?.status === 'verified')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const lowStockItems = inventory.filter(i => i.currentStock <= (i.lowStockThreshold || 10));

    return sendJson(res, 200, {
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
  }

  // GET /api/admin/orders
  if (pathname === '/api/admin/orders' && req.method === 'GET') {
    const store = getStore();
    return sendJson(res, 200, { success: true, count: store.orders.length, data: store.orders });
  }

  // PATCH /api/admin/orders/:orderId/payment
  if (pathname.includes('/payment') && req.method === 'PATCH') {
    const match = pathname.match(/\/api\/admin\/orders\/(.+)\/payment/);
    if (match) {
      const orderId = match[1].toUpperCase();
      const body = await readBody(req);
      const store = getStore();
      const order = store.orders?.find(o => o.orderId.toUpperCase() === orderId);
      if (!order) return sendJson(res, 404, { success: false, message: 'Order not found' });

      order.payment.status = body.status;
      if (body.status === 'verified') {
        order.payment.verifiedAt = new Date().toISOString();
        order.orderStatus = 'payment_verified';
        order.timeline.push({
          status: 'payment_verified',
          note: 'QR Payment verified by admin.',
          timestamp: new Date().toISOString()
        });

        // Deduct inventory
        for (const item of order.items) {
          const sku = `TSHIRT-${item.color.toUpperCase().replace(/\s+/g, '')}-${item.size}`;
          const invItem = store.inventory?.find(i => i.sku === sku);
          if (invItem) {
            invItem.currentStock = Math.max(0, invItem.currentStock - item.quantity);
          }
        }
      } else {
        order.payment.rejectionReason = body.rejectionReason || 'Receipt rejected.';
        order.timeline.push({
          status: 'payment_rejected',
          note: `Payment rejected: ${order.payment.rejectionReason}`,
          timestamp: new Date().toISOString()
        });
      }

      saveStore(store);
      return sendJson(res, 200, { success: true, data: order });
    }
  }

  // PATCH /api/admin/orders/:orderId/status
  if (pathname.includes('/status') && req.method === 'PATCH') {
    const match = pathname.match(/\/api\/admin\/orders\/(.+)\/status/);
    if (match) {
      const orderId = match[1].toUpperCase();
      const body = await readBody(req);
      const store = getStore();
      const order = store.orders?.find(o => o.orderId.toUpperCase() === orderId);
      if (!order) return sendJson(res, 404, { success: false, message: 'Order not found' });

      order.orderStatus = body.status;
      order.timeline.push({
        status: body.status,
        note: body.note || `Status updated to ${body.status}`,
        timestamp: new Date().toISOString()
      });
      saveStore(store);
      return sendJson(res, 200, { success: true, data: order });
    }
  }

  // POST /api/upload/artwork
  if (pathname === '/api/upload/artwork' && req.method === 'POST') {
    try {
      const fileUrl = await handleFileUpload(req, artworksDir, 'artwork');
      return sendJson(res, 200, { success: true, url: fileUrl });
    } catch (e) {
      return sendJson(res, 500, { success: false, message: 'Upload failed' });
    }
  }

  // POST /api/upload/receipt
  if (pathname === '/api/upload/receipt' && req.method === 'POST') {
    try {
      const fileUrl = await handleFileUpload(req, receiptsDir, 'receipt');
      return sendJson(res, 200, { success: true, url: fileUrl });
    } catch (e) {
      return sendJson(res, 500, { success: false, message: 'Upload failed' });
    }
  }

  // Static files serving for client/dist and SPA fallback
  const distDir = path.resolve(__dirname, '../client/dist');
  if (!pathname.startsWith('/api') && !pathname.startsWith('/uploads')) {
    let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff2': 'font/woff2'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const fileData = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      return res.end(fileData);
    }
  }

  // 404 Fallback
  return sendJson(res, 404, { success: false, message: `Route ${pathname} not found` });
});

server.listen(PORT, () => {
  console.log(`[Dhango Nepal Server] Online at http://localhost:${PORT}`);
});
