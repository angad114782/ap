const mongoose = require("mongoose");

const referralTreeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // who referred
  level: { type: Number, default: 1 }, // A=1, B=2, C=3...
  path: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ancestry path from root
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReferralTree", referralTreeSchema);
