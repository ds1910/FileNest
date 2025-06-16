const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const pRetry = require("p-retry");

// 📦 x p-retry: Automatically retries a failed async function (like file upload)
// 👉 Useful when calling unstable external services (e.g. Cloudinary, APIs)
// 🔁 Helps handle temporary issues like network failure or rate limits



const uploadWithRetry = async (localFilePath) => {
  const upload = async () => {
    // Attempt Cloudinary upload
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", 
    });

    console.log("✅ Uploaded successfully:", res.url);
    return res;
  };

  try {

     // Retry up to 3 times with exponential backoff if upload fails
    // ⏳ Exponential Backoff: Increases wait time after each failed retry (e.g. 1s, 2s, 4s)
   // 🎯 Reduces load on server, avoids hitting rate limits, gives time to recover
  // 🚀 Built-in to p-retry for smarter and safer retries in production


    const response = await pRetry(upload, { retries: 5 });

    // 🔄 Cleanup: delete local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("⚠️ Failed to delete local file after upload:", err);
    });

    return response;

  } catch (err) {
    console.error("❌ Cloudinary upload failed after retries:", err);

    // ⛔ Ensure cleanup of local temp file even after failure
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("⚠️ Failed to delete local file after upload failure:", err);
    });

    return null;
  }
};

module.exports = uploadWithRetry;
