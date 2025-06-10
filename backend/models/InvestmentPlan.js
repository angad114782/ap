const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    minAmount: {
      type: Number,
      required: true
    },
    maxAmount: {
      type: Number,
      required: true
    },
    roi: {
      type: Number, // Return on Investment (in %)
      required: true
    },
    durationDays: {
      type: Number,
      required: false // e.g., 30 days
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvestmentPlan", investmentPlanSchema);
