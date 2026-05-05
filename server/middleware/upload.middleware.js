const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') return cb(new Error('Only CSV files allowed'), false);
  cb(null, true);
};

module.exports = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } 
});
