const UserInvestment = require("../models/UserInvestment");
const InvestmentPlan = require("../models/InvestmentPlan");

exports.getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const investments = await UserInvestment.find({ userId })
      .populate("planId", "name durationDays roi");

    const portfolio = investments.map((inv) => {
      const today = new Date();
      const end = new Date(inv.endDate);
      const daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));

      return {
        planName: inv.planId?.name || "N/A",
        amountInvested: inv.amount,
        roi: inv.roi,
        dailyEarning: inv.dailyEarning,
        totalDays: inv.totalDays,
        daysLeft,
        earnedTillNow: inv.earnedTillNow,
        startDate: inv.startDate,
        endDate: inv.endDate,
        isCompleted: inv.isCompleted
      };
    });

    res.status(200).json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio", error: err.message });
  }
};
