const multer = require('multer');

// Use memory storage (files stored in memory as Buffer, not on disk)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    console.log("=== MULTER FILE FILTER ===");
    console.log("File received:", file.originalname);
    console.log("MIME type:", file.mimetype);
    console.log("========================");

    // Allowed image MIME types
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        // Accept file
        cb(null, true);
    } else {
        // Reject file
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

module.exports = upload;