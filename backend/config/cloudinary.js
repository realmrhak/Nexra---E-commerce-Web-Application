import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

/**
 * Cloudinary configuration.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Memory storage — files are kept in memory and uploaded to Cloudinary
 * via the uploader API in the route handler. This avoids the
 * multer-storage-cloudinary peer-dependency conflict.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|avif/;
    const ok = allowed.test(file.mimetype) || allowed.test(file.originalname.toLowerCase());
    if (ok) return cb(null, true);
    cb(new Error('Only image files (jpg, png, webp, gif, avif) are allowed.'));
  },
});

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {String} folder - cloudinary folder name (e.g. 'products', 'avatars')
 * @param {String} [publicId] - optional public id; auto-generated if omitted
 * @returns {Promise<{url:string, public_id:string, width:number, height:number, bytes:number}>}
 */
export const uploadToCloudinary = async (buffer, folder = 'general', publicId) => {
  if (!buffer) throw new Error('No buffer provided to uploadToCloudinary.');

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `nexra/${folder}`,
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
      resource_type: 'image',
    };
    if (publicId) uploadOptions.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      });
    });
    stream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary by public_id.
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.warn('Cloudinary delete failed:', err.message);
  }
};

export default cloudinary;
