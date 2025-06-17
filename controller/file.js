const uploadToCloudinary = require("../service/cloudinary");

const handelUploadToCloud = async (req, res, next) => {
  try {
  
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localFilePath = req.file.path;

    
    const result = await uploadToCloudinary(localFilePath);

   
    return res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
    });

  } catch (err) {
    next(err); 
  }
};

module.exports = { handelUploadToCloud };
