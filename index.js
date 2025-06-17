// Essential requires
const express = require("express");
const path = require("path");
require('dotenv').config();

// Connection and middleware requires
const connectMongoDb = require("./connection");
const { logReqRes } = require("./middleware");
const upload = require("./middleware/multer");
const isError = require("./middleware/error");


const {handelUploadToCloud} = require("./controller/file");

// App initialization
const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom request logging middleware
app.use(logReqRes("log.txt"));


// Connect to MongoDB
connectMongoDb("mongodb://127.0.0.1:27017/BugVault")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// File upload route
app.post("/upload", upload.single("profileImage"), handelUploadToCloud);

// Error-handling middleware (must be last)
app.use(isError);

// Start server
app.listen(port, () => console.log(`Server Started`));
