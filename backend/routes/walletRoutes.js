const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addWallet,
  getUserWallets,
  updateWallet,
  toggleWalletStatus,
  updateWalletBalance,
  getTotalWalletBalance,
  getUserPassbook,
  getAllPassbooks,
  getAdminWallets,
  deleteWallet,
  getUserActiveWallet,
  getVirtualWalletBalance, // ✅ NEW CONTROLLER
} = require("../controllers/walletController");

const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Multer setup for QR uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/qr"),
  filename: (req, file, cb) => {
    const uniqueName = "qr-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ USER WALLET ROUTES
router.post("/wallet", verifyToken, upload.single("qrImage"), addWallet);
router.get("/wallet", verifyToken, getUserWallets);
router.get("/wallet/my", verifyToken, getUserWallets); // Alias for frontend
router.get("/wallet/active", verifyToken, getUserActiveWallet);
router.put("/wallet/:walletId", verifyToken, upload.single("qrImage"), updateWallet);
router.put("/wallet/set-active/:walletId", verifyToken, toggleWalletStatus);
router.delete("/wallet/:walletId", verifyToken, deleteWallet);

// ✅ VIRTUAL WALLET ROUTES
router.get("/wallets/virtual-balance", verifyToken, getVirtualWalletBalance); // 👈 New route

// ✅ BALANCE (for individual user wallets, not virtual)
router.put("/wallet/:walletId/balance", verifyToken, updateWalletBalance);
router.get("/wallet/total", verifyToken, getTotalWalletBalance);

// ✅ PASSBOOKS
router.get("/wallet/passbook", verifyToken, getUserPassbook);
router.get("/admin/wallets", verifyToken, getAdminWallets);
router.get("/admin/passbooks", verifyToken, getAllPassbooks);

module.exports = router;
