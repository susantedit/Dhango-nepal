import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    trim: true
  },
  colorHex: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['S', 'M', 'L', 'XL', 'XXL']
  },
  currentStock: {
    type: Number,
    required: true,
    default: 50,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  sku: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

inventorySchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `TSHIRT-${this.color.toUpperCase().replace(/\s+/g, '')}-${this.size}`;
  }
  next();
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
export default Inventory;
