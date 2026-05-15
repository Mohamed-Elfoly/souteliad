const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isDev = process.env.NODE_ENV !== 'production';

// In development: save to public/uploads/{folder}/
// In production: upload to Cloudinary
const uploadImage = (fileBuffer, folder) => {
  if (isDev) {
    return new Promise((resolve, reject) => {
      try {
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', folder);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filename = `${folder}-${Date.now()}.jpg`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, fileBuffer);

        // Return a local URL the frontend can access
        resolve(`/uploads/${folder}/${filename}`);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Production: Cloudinary
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

module.exports = { uploadImage };
