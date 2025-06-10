const mongoose = require("mongoose");

const sendCurrencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ This must be correct!
    required: true,
  },
  amount: { type: Number, required: true },
  wallet: { type: String, required: true },
  walletID: { type: String, required: true },
  userActiveWalletID: {
    type: String,
    required: true,
  },
  userActiveWalletType: {
    type: String,
    required: true,
  },
  screenshot: { type: String }, // saved file name or path
  status: {
    type: String,
    enum: ["Pending", "Approved", "Disapproved"],
    default: "Pending",
  },
  remark: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SendCurrency", sendCurrencySchema);
