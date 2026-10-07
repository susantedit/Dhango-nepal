import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number,
    default: 2000 // Rs. 2,000 standard price
  },
  salePrice: {
    type: Number,
    default: 1500 // Rs. 1,500 active promotional price
  },
  category: {
    type: String,
    enum: ['classic', 'oversized', 'polo', 'hoodie', 'streetwear'],
    default: 'classic'
  },
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true }
  }],
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL', 'XXL']
  },
  material: {
    type: String,
    default: '100% Super-Combed Ring-Spun Cotton (220 GSM)'
  },
  printMethods: {
    type: [String],
    default: ['Direct-to-Garment (DTG)', 'High-Density Screen Print']
  },
  defaultArtwork: {
    type: String,
    default: ''
  },
  previewImage: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
