import multer from 'multer';
import path from 'path';
import fs from 'fs';

const fsp = fs.promises;

const uploadDir =
  process.env.ACCREDITATION_DOCUMENT_PATH ||
  'C:/WDMS/uploads/accreditation-documents';

// Ensure root directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);           // ".pdf"
    const baseName = path.basename(file.originalname, ext); // "document"
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const finalName = `${baseName}-${uniqueSuffix}${ext}`; // "document-123456789.pdf"

    req.savedFileName = file.originalname;
    req.savedFilePath = finalName; // full path on server

    cb(null, finalName);
  }
});

export const upload = multer({ storage });
