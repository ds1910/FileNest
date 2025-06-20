const express = require("express");
const {
  handelUploadToCloud,
  handelViewFromCloud,
  handelDownloadFromCloud,
} = require("../controller/file");

const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home.ejs");
});


router.post("/upload", upload.single("profileImage"), handelUploadToCloud);
router.get("/view/:id", handelViewFromCloud);
router.get("/download/:id", handelDownloadFromCloud);

module.exports = router;
