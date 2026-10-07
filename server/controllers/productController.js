import Product from '../models/Product.js';
import { isConnectedToMongo } from '../config/db.js';
import { getStore, saveStore } from '../config/fallbackStore.js';
import { initialProducts } from '../data/seedData.js';

export const getProducts = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      let products = await Product.find().lean();
      if (products.length === 0) {
        await Product.insertMany(initialProducts);
        products = await Product.find().lean();
      }
      return res.json({ success: true, count: products.length, data: products });
    }

    // Fallback store
    const store = getStore();
    if (!store.products || store.products.length === 0) {
      store.products = [...initialProducts];
      saveStore(store);
    }
    return res.json({ success: true, count: store.products.length, data: store.products });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (isConnectedToMongo) {
      const product = await Product.findOne({ slug }).lean();
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }

    const store = getStore();
    const product = store.products?.find(p => p.slug === slug || p.id === slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving product' });
  }
};
