// Essential requires
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require('dotenv').config();


// Database requires
const USER = require("./model/user");

// Connection To MongoDB 
const connectMongoDb = require("./connection");

//  middleware requires
const { logReqRes, checkAuthentication, restrictTo } = require("./middleware");
const isError = require("./middleware/error");


// Routers
const userRouter = require("./routes/user");
const mediaRouter = require("./routes/media");

// App initialization
const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logReqRes("log.txt"));


// Connect to MongoDB
connectMongoDb("mongodb://127.0.0.1:27017/BugVault")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
app.use("/user", userRouter);
app.use("/media",checkAuthentication, mediaRouter);


// Error-handling middleware (must be last)
app.use(isError);

// Start server
app.listen(port, () => console.log(`Server Started`));
