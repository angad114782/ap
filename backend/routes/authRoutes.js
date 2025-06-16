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
  resetPassword, // ✅ this must be here
  getInvestorCount,
  getAllUserWallets,
  getMyWallet,
  verifyOtp,
  getAllUsers,
  getMe ,
  getUserById,
} = require("../controllers/authController");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/set-mpin", setMpin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);           
router.post("/change-password", auth, resetPassword); 
router.put("/update-profile", auth, upload.single("profilePic"), updateProfile);
router.get("/user/:id", getUserById);

// Admin Routes
router.get("/admin/all-users", auth, isAdmin, getAllUsers);
router.get("/admin/investors-count", auth, isAdmin, getInvestorCount);
router.get("/my-wallet", auth, getMyWallet);
router.get("/admin/wallets", auth, isAdmin, getAllUserWallets);
router.get("/myprofile", auth, getMe);

router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

router.get("/", (req, res) => {
  res.send("Auth API working on server");
});

module.exports = router;
