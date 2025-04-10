// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = './uploads/'; // Define the upload directory path

// Ensure upload directory exists synchronously on startup
if (!fs.existsSync(uploadDir)){
    try {
        fs.mkdirSync(uploadDir, { recursive: true }); // Use recursive if needed
        console.log(`Upload directory created: ${uploadDir}`);
    } catch (err) {
        console.error(`Error creating upload directory: ${err}`);
        process.exit(1);
    }
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save files to the uploads directory
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.ext
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type (keep this function)
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

// Init upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit example
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profilePicture');

module.exports = upload;