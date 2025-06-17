const multer = require("multer");
const path = require("path");

const fileFilter = (req,file,cb) => {
   if(file.mimetype.startsWith('image/'))cb(null,true);
   else cb(new Error('Only image files are allowed!'), false); 
};


// Define custom storage configuration
const storage = multer.diskStorage({
  // Destination folder where files will be stored
  destination: function (req, file, cb) {
    cb(null, "./uploads");  
  },

  // Set unique filename to avoid name collisions
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});


// Create the multer instance with the defined storage config
const upload = multer({
   storage: storage,
   fileFilter: fileFilter,
   limits: { fileSize: 5 * 1024 * 1024 } 
 });

module.exports = upload;

