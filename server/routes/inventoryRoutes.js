import express from 'express';
import { getInventory, updateStock } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/update', updateStock);

export default router;
