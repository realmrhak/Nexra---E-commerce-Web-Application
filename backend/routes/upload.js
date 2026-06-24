import express from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { uploadLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// POST /api/upload/image
// Body: multipart/form-data with field name "image" and optional "folder"
router.post(
  '/image',
  protect,
  uploadLimiter,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded.');

    const folder = (req.body.folder || 'general').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(201).json({
      success: true,
      data: result,
    });
  })
);

// DELETE /api/upload/image/:public_id  (public_id is URL-encoded)
router.delete(
  '/image/:publicId',
  protect,
  asyncHandler(async (req, res) => {
    const publicId = decodeURIComponent(req.params.publicId);
    await deleteFromCloudinary(publicId);
    res.json({ success: true, message: 'Image deleted.' });
  })
);

export default router;
