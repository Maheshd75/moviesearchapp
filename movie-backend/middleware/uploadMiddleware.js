const multer = require('multer');
const path = require('path');
// No need for 'fs' module if you're not writing to disk

// Use memory storage instead of disk storage
const storage = multer.memoryStorage(); // <--- Change this line!

// Check file type (remains the same)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init upload
const upload = multer({
    storage: storage, // Use the memory storage
    limits: { fileSize: 10000000 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

module.exports = upload;
