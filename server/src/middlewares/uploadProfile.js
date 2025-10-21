import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const isProd = process.env.NODE_ENV === "production";

// --- Cloudinary setup for production ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Common variables ---
const localDir =
  process.env.PROFILE_PIC_PATH || "C:/WDMS/uploads/user-profile-pictures";

if (!fs.existsSync(localDir)) {
  fs.mkdirSync(localDir, { recursive: true });
}

let upload;

// --- Use Cloudinary in production ---
if (isProd) {
  const tempDir = "temp/";
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempDir),
  });

  upload = multer({ storage: tempStorage });
  upload.handleUpload = async (filePath, folder = "profile-pics") => {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // delete local temp file
    return result.secure_url; // return Cloudinary URL
  };
} else {
  // --- Use local file storage for development ---
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, localDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + ext);
    },
  });

  upload = multer({ storage: localStorage });
  upload.handleUpload = async (filePath) => {
    // In dev, just return local path
    return path.join("/uploads/user-profile-pictures", path.basename(filePath));
  };
}

export default upload;

