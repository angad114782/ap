const mongoose = require("mongoose");

const referralEarningLogSchema = new mongoose.Schema({
  earnedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Upline
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Downline
  level: { type: Number, required: true }, // Level A=1, B=2, C=3...
  amount: { type: Number, required: true }, // Commission earned
  reason: { type: String }, // E.g., "First Deposit", "Plan Investment"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReferralEarningLog", referralEarningLogSchema);
