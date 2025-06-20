const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Referral Bonus", "Income", "Paid", "Invest","ROI Withdraw & Exit", "Partial ROI Withdraw","Milestone Reward"
    ],
    required: true,
  },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  walletID: { type: String }, // optional, shown in UI
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
