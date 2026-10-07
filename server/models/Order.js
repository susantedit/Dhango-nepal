import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Custom Printed T-Shirt'
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    default: 1500 // Rs. 1,500
  },
  artworkUrl: {
    type: String,
    default: ''
  },
  mockupUrl: {
    type: String,
    default: ''
  },
  printPlacement: {
    zone: { type: String, default: 'front' }, // front, back, chest-pocket
    scale: { type: Number, default: 1 },
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 }
  },
  customText: {
    text: String,
    font: String,
    color: String
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  firebaseUid: {
    type: String,
    default: null
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    province: { type: String, required: true },
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    deliveryNotes: { type: String, default: '' }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  payment: {
    method: {
      type: String,
      default: 'QR_TRANSFER'
    },
    transactionCode: {
      type: String,
      required: true
    },
    receiptSlipUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date,
    rejectionReason: String
  },
  orderStatus: {
    type: String,
    enum: ['received', 'payment_verified', 'in_printing', 'shipped', 'delivered', 'cancelled'],
    default: 'received'
  },
  timeline: [{
    status: String,
    note: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
