const USER = require("../model/user");
const resetTokenModel = require("../model/resetToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); 

// Other files: Importing token generation and verification utilities
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../service/auth");


// ==========================================
// ========== Handle User Signup ============
// ==========================================
const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log(req.body);

  try {
    await USER.create({ name, email, password });


    const loginURL =  `http://localhost:${process.env.PORT}/user/login`;
    sendmailForSignup({email,name,loginURL});

    if (req.is("application/json")) { 
      return res.status(201).json({ message: "Signup successful" });
    } else {
      return res.redirect("/signup");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong during signup" });
  }
};


// =========================================
// =========== Handle User Login ===========
// =========================================
const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await USER.findOne({ email });

  if (!user) {
    if (req.is("application/json")) {
      return res.status(401).json({ error: "Invalid email" });
    } else {
      return res.render("login", { error: "Invalid email" });
    }
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    if (req.is("application/json")) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      return res.render("login", { error: "Invalid password" });
    }
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Set secure cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  if (req.is("application/json")) {
    return res.status(201).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } else {
    return res.redirect("/");
  }
};


// ==========================================
// ================ Logout ==================
// ==========================================
const handleLogout = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out" });
};


// ==========================================
// ============ Render Pages ================
// ==========================================
const handleGetSignup = (req, res) => {
  return res.render("signup");
};

const handleGetLogin = (req, res) => {
  return res.render("login");
};


// ==========================================
// ============ Module Exports ==============
// ==========================================
module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleGetSignup,
  handleGetLogin,
  handleLogout,
};
