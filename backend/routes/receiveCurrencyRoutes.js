const express = require("express");
const router = express.Router();
const receiveController = require("../controllers/receiveCurrencyController");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Create receive request
router.post("/receive", verifyToken, receiveController.createReceiveCurrency);

// ✅ Get all receive requests (admin panel)
router.get("/receive", verifyToken, receiveController.getAllReceiveRequests);

// ✅ Get single request by ID
router.get(
  "/receive/:id",
  verifyToken,
  receiveController.getReceiveRequestById
);

// ✅ Approve / Disapprove
router.put(
  "/receive/:id/status",
  verifyToken,
  receiveController.updateReceiveStatus
);

module.exports = router;
