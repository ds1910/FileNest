// Essential requires
const express = require("express");
const path = require("path");
require('dotenv').config();


// Connection and middleware requires
const connectMongoDb = require("./connection");
const { logReqRes } = require("./middleware");
const upload = require("./middleware/multer");

// App initialization
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine","ejs");
app.set("views",path.resolve("./view"));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));


// Connect to MongoDB
connectMongoDb("mongodb://127.0.0.1:27017/BugVault").then(() => {
  console.log("MongoDB connected");
});


// Routes
app.get("/", (req,res) => {
   res.render("home.ejs");
});

app.post("/upload", upload.single("profileImage"), (req,res) => {
  console.log(req.body);
  console.log(req.file);
  return res.redirect("/");
});


// Start server
app.listen(port, () => console.log("Server started"));
