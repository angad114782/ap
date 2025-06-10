const express = require("express");
const router = express.Router();

const { verifyToken: auth } = require("../middlewares/authMiddleware");

const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/uploadMiddleware");

const {
  registerUser,
  loginUser,
  setMpin,
  updateProfile,
  forgotPassword,
  changePassword, // ✅ this must be here
  getInvestorCount,
  getAllUserWallets,
  sendOtpForReset,
  getMyWallet,
  verifyOtpAndResetPassword,
} = require("../controllers/authController");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/set-mpin", setMpin);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", auth, changePassword);
router.put("/update-profile", auth, upload.single("profilePic"), updateProfile);

// Admin Routes
router.get("/admin/investors-count", auth, isAdmin, getInvestorCount);
router.get("/my-wallet", auth, getMyWallet);
router.get("/admin/wallets", auth, isAdmin, getAllUserWallets);
router.post("/send-otp", auth, sendOtpForReset);
router.post("/reset-password", auth, verifyOtpAndResetPassword);

router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

router.get("/", (req, res) => {
  res.send("Auth API working on server");
});

module.exports = router;
