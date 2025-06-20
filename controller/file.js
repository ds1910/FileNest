const uploadToCloudinary = require("../service/cloudinary");
const File = require("../model/file");

const handelUploadToCloud = async (req, res, next) => {
  try {
     
    const userId = req.user.id;
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localFilePath = req.file.path;

    await File.create({ localFilePath,userId});     
    const result = await uploadToCloudinary(localFilePath);
    
   
    return res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
    });

  } catch (err) {
    next(err); 
  }
};

const handelViewFromCloud = async (req, res, next) => {
    const fileId = req.params.id;
    const userId = req.user.id;

    const file = await File.findbyId(fileId);
    if(!file)res.status(400).json({ message: "No file found" });

    if(file.ownerId.toString()  !== userId)res.status(403).json({ message: "Acces Denied" });

    const signedUrl = await generateSignedURL(file);

    const response = await fetch(signedUrl);
    
      response.body.pipe(res);

};

module.exports = { 
  handelUploadToCloud,
  handelViewFromCloud, 
};
