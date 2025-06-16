const mongoose = require("mongoose");

const RewardMilestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // upline
  downlineId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  milestone: Number, // e.g., 1000, 2500, etc.
  rewardAmount: Number, // 10% of milestone
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("RewardMilestone", RewardMilestoneSchema);