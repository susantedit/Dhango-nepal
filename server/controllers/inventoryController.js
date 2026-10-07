import Inventory from '../models/Inventory.js';
import { isConnectedToMongo } from '../config/db.js';
import { getStore, saveStore } from '../config/fallbackStore.js';
import { generateInitialInventory } from '../data/seedData.js';

export const getInventory = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      let items = await Inventory.find().lean();
      if (items.length === 0) {
        const initial = generateInitialInventory();
        await Inventory.insertMany(initial);
        items = await Inventory.find().lean();
      }
      return res.json({ success: true, count: items.length, data: items });
    }

    const store = getStore();
    if (!store.inventory || store.inventory.length === 0) {
      store.inventory = generateInitialInventory();
      saveStore(store);
    }
    return res.json({ success: true, count: store.inventory.length, data: store.inventory });
  } catch (error) {
    console.error('Error in getInventory:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving inventory' });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { sku, currentStock } = req.body;
    if (!sku || currentStock === undefined) {
      return res.status(400).json({ success: false, message: 'SKU and currentStock are required' });
    }

    const stockNum = Math.max(0, parseInt(currentStock, 10));

    if (isConnectedToMongo) {
      const updated = await Inventory.findOneAndUpdate(
        { sku },
        { currentStock: stockNum },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Inventory item not found' });
      }
      return res.json({ success: true, data: updated });
    }

    const store = getStore();
    const item = store.inventory?.find(i => i.sku === sku);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    item.currentStock = stockNum;
    saveStore(store);
    return res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error in updateStock:', error);
    res.status(500).json({ success: false, message: 'Server error updating stock' });
  }
};
