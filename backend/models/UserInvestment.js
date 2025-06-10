const mongoose = require("mongoose");

const userInvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentPlan", required: true },
  amount: { type: Number, required: true },
  roi: { type: Number, required: true },
  dailyEarning: { type: Number, required: true },
  totalDays: { type: Number }, // optional, still allowed
  earnedTillNow: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false }, // used when exiting
});

module.exports = mongoose.model("UserInvestment", userInvestmentSchema);
