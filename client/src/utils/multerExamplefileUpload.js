import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// Example: determine folder based on request data (e.g., user ID, program, area)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // e.g., folder structure: uploads/<program>/<area>/
    const { program, area } = req.body;
    const uploadPath = path.join(__dirname, 'uploads', program, area);

    // Make sure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));

const formData = new FormData();
formData.append('file', file);
formData.append('program', 'CS');  // dynamic folder
formData.append('area', 'Networking'); // dynamic folder

axios.post('http://localhost:5000/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
