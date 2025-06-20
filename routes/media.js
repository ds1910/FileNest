const express = require("express");
const {handelUploadToCloud,handelViewFromCloud} = require("../controller/file");
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home.ejs");
});


router.route("/upload").post(upload.single("profileImage"), handelUploadToCloud);
router.route("/view/:id").post(handelViewFromCloud);



module.exports = router;
