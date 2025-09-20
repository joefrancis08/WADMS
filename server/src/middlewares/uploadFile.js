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

// Sanitize filename to prevent path traversal
const sanitizeName = (name) =>
  name.replace(/[^a-zA-Z0-9-_.]/g, '-');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const {
      title,
      year,
      level,
      program,
      area,
      parameter = '',
      subParameter = '',
      indicator = '',
    } = req.body;

    if (!program || !area || !title || !year || !level) {
      return cb(new Error('Missing required fields'), null);
    }

    // Sanitize all path segments
    const safeProgram = sanitizeName(program);
    const safeArea = sanitizeName(area);
    const safeLevel = sanitizeName(level);
    const safeTitle = sanitizeName(title);
    const safeYear = sanitizeName(year.toString());
    const safeParam = parameter ? sanitizeName(parameter) : '';
    const safeSubParam = subParameter ? sanitizeName(subParameter) : '';
    const safeIndicator = indicator ? sanitizeName(indicator) : '';

    const uploadPath = path.join(
      uploadDir,
      `${safeTitle}-${safeYear}`,
      safeLevel,
      safeProgram,
      safeArea,
      safeParam,
      safeSubParam,
      safeIndicator,
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    // Store the absolute path
    req.uploadPath = uploadPath;

    cb(null, uploadPath);
  },

  filename: async (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const safeName = sanitizeName(baseName.replace(/\s+/g, '-').toLowerCase());
      const finalName = safeName + ext;

      const fullPath = path.join(req.uploadPath, finalName);

      // If file already exists, back it up
      if (fs.existsSync(fullPath)) {
        const backupName = `${safeName}-${Date.now()}-old${ext}`;
        const backupPath = path.join(req.uploadPath, backupName);
        await fsp.rename(fullPath, backupPath);
      }

      // Save URL-friendly path for frontend use
      const relativePath = path
        .relative(uploadDir, fullPath) // relative path from root upload dir
        .split(path.sep)              // split by system separator
        .join('/');                   // join as forward slashes

      req.savedFilePath = `/uploads/accreditation-documents/${relativePath}`;

      cb(null, finalName);
    } catch (err) {
      cb(err, null);
    }
  },
});

export const upload = multer({ storage });
