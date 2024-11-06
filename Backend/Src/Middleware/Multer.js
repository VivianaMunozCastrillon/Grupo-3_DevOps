const multer = require('multer');
const path = require('path');

// Configura multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;
