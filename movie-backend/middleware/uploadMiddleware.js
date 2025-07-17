const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    // You can set a destination, but Cloudinary will handle the actual storage.
    // Multer needs a temporary location to store the file before Cloudinary processes it.
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be temporarily stored in an 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Use fieldname-timestamp.ext for unique filenames
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

module.exports = upload;