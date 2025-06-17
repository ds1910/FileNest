const fs = require("fs");

// Middleware to log request and response info
const logReqRes = (fileName) => {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `\n${Date.now()} - ${req.method} - ${req.path}\n`,
      (err) => {
        if (err) {
          console.error("Error logging request:", err);
        }
        next();
      }
    );
  };
};

  
module.exports = {
  logReqRes,
};
