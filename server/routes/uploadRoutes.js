import express from 'express';
import { uploadArtwork, uploadReceipt } from '../middleware/upload.js';

const router = express.Router();

router.post('/artwork', uploadArtwork.single('artwork'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No artwork file uploaded' });
    }
    const fileUrl = `/uploads/artworks/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Artwork upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing artwork upload' });
  }
});

router.post('/receipt', uploadReceipt.single('receipt'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No receipt file uploaded' });
    }
    const fileUrl = `/uploads/receipts/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Receipt upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing receipt upload' });
  }
});

export default router;
