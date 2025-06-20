const uploadToCloudinary = require("../service/cloudinary");
const File = require("../model/file");
const fetch = require("node-fetch"); 
const generateSignedURL = require("../service/generateSignedURL");

const handelUploadToCloud = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localFilePath = req.file.path;
    const result = await uploadToCloudinary(localFilePath);

    await File.create({
      fileId: result.public_id,
      ownerId: userId,
    });

    return res.status(200).json({
      message: "File uploaded successfully",
      url: result.public_id,
    });
  } catch (err) {
    next(err);
  }
};

const handelViewFromCloud = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    const file = await File.findById(fileId); 
    if (!file) return res.status(400).json({ message: "No file found" });
    if (file.ownerId.toString() !== userId)
      return res.status(403).json({ message: "Access Denied" });

    const signedUrl = await generateSignedURL(file.fileId);
    const response = await fetch(signedUrl);

    if (!response.ok)
      return res.status(500).json({ message: "Failed to fetch file from Cloudinary" });

    res.setHeader("Content-Type", response.headers.get("content-type"));
    res.setHeader("Content-Length", response.headers.get("content-length"));
    res.setHeader("Content-Disposition", `inline; filename="${file.fileId}"`);

    response.body.pipe(res);
  } catch (err) {
    next(err);
  }
};

const handelDownloadFromCloud = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    const file = await File.findById(fileId); 
    if (!file) return res.status(400).json({ message: "No file found" });
    if (file.ownerId.toString() !== userId)
      return res.status(403).json({ message: "Access Denied" });

    const signedUrl = await generateSignedURL(file.fileId);
    const fullFileName = `myfile_${Date.now()}.png`;

    const response = await fetch(signedUrl);
    if (!response.ok)
      return res.status(500).json({ message: "Failed to fetch file from Cloudinary" });

    res.setHeader("Content-Type", response.headers.get("content-type"));
    res.setHeader("Content-Length", response.headers.get("content-length"));
    res.setHeader("Content-Disposition", `attachment; filename="${fullFileName}"`);

    response.body.pipe(res);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handelUploadToCloud,
  handelViewFromCloud,
  handelDownloadFromCloud,
};
