const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads from local disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // Use path.join to resolve the path correctly
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use a timestamp to avoid overwriting files with the same name
  }
});

// Initialize multer
const upload = multer({ storage });

module.exports = upload;
