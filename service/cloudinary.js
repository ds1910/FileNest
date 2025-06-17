const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const pRetry = require("p-retry").default;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
,
});

// 📦 x p-retry: Automatically retries a failed async function (like file upload)
// 👉 Useful when calling unstable external services (e.g. Cloudinary, APIs)
// 🔁 Helps handle temporary issues like network failure or rate limits



const uploadWithRetry = async (localFilePath) => {

  const upload = async () => {
    try {
      const result = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
         type: "authenticated",
      });
      console.log("Uploaded to Cloudinary:", result.secure_url);
      return result;
    } catch (err) {
      console.log(err);
      console.warn("Upload failed, retrying...");
      throw err;
    }
  };

  try {
   
     // Retry up to 3 times with exponential backoff if upload fails
    // ⏳ Exponential Backoff: Increases wait time after each failed retry (e.g. 1s, 2s, 4s)
   // 🎯 Reduces load on server, avoids hitting rate limits, gives time to recover
  // 🚀 Built-in to p-retry for smarter and safer retries in production

    const response = await pRetry(upload, { retries: 3 });

    // Delete local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    return response;

  } catch (err) {
    console.error("Cloudinary upload failed after retries:", err);

    // Delete local file even on failure
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file after failure:", err);
    });

    return null;
  }
};

module.exports = uploadWithRetry;


   