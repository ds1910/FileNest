const express = require("express");
const { handelUploadToCloud,
  handelViewFromCloud,
  handelDownloadFromCloud} = require("../controller/file");

const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home.ejs");
});


router.route("/upload").post(upload.single("profileImage"), handelUploadToCloud);
router.route("/view/:id").post(handelViewFromCloud);
router.route("/download/:id").post(handelDownloadFromCloud);



module.exports = router;
