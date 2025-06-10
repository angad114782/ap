// models/VirtualWallet.js
const mongoose = require("mongoose");

const virtualWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ✅ one wallet per user
    },
    balance: {
      type: Number,
      default: 0,
    },
    locked: {
      type: Number,
      default: 0, // e.g. funds frozen while withdrawal pending
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VirtualWallet", virtualWalletSchema);
