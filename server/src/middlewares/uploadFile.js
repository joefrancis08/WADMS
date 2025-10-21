import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';

let storage;

if (isProd) {
  // Cloudinary for production
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'accreditation-documents',
      allowed_formats: ['pdf', 'docx', 'jpg', 'png'],
    },
  });
} else {
  // Local for development
  const uploadDir =
    process.env.ACCREDITATION_DOCUMENT_PATH ||
    'C:/WDMS/uploads/accreditation-documents';
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const final = `${base}-${unique}${ext}`;
      req.savedFileName = file.originalname;
      req.savedFilePath = final;
      cb(null, final);
    },
  });
}

export const upload = multer({ storage });
