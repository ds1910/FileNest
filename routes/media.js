const express = require("express");
const {handelUploadToCloud} = require("./controller/file");
const upload = require("./middleware/multer");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home.ejs");
});


router.post("/upload", upload.single("profileImage"), handelUploadToCloud);


module.exports = router;
