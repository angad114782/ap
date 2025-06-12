


const InvestmentPlan = require("../models/InvestmentPlan");
const UserInvestment = require("../models/UserInvestment");

const ReferralTree = require("../models/ReferralTree");
const VirtualWallet = require("../models/VirtualWallet");
const ReferralEarningLog = require("../models/ReferralEarningLog");
const WalletTransaction = require("../models/WalletTransaction");

exports.investInPlan = async (req, res) => {
  try {
    const { planId, amount } = req.body;
    const userId = req.user._id;

    const plan = await InvestmentPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: "Invalid or inactive plan" });
    }

    if (amount < plan.minAmount || amount > plan.maxAmount) {
      return res.status(400).json({ message: "Amount out of allowed range" });
    }

    const wallet = await VirtualWallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient virtual wallet balance" });
    }

    const dailyEarning = amount * (plan.roi / 100);

    const newInvestment = new UserInvestment({
      userId,
      planId,
      amount,
      roi: plan.roi,
      dailyEarning,
      totalDays: plan.totalDays || undefined, // optional field
    });
    await newInvestment.save();

    wallet.balance -= amount;
    await wallet.save();

    await WalletTransaction.create({
      userId,
      type: "Invest",
      amount,
      balanceAfter: wallet.balance,
      description: `Invested in ${plan.name} plan`,
    });

    // ✅ Referral bonus logic: Only last 3 uplines get reward (immediate parents)
    const levels = [6, 3, 1]; // percentages for level 1 to 3
    const uplines = [];
    let currentUserId = userId;

    for (let i = 0; i < 3; i++) {
      const ref = await ReferralTree.findOne({ childId: currentUserId });
      if (!ref || !ref.parentId) break;

      uplines.push(ref.parentId);
      currentUserId = ref.parentId;
    }

    for (let i = 0; i < uplines.length; i++) {
      const parentId = uplines[i];
      const bonusPercent = levels[i];
      const bonusAmount = (amount * bonusPercent) / 100;

      let parentWallet = await VirtualWallet.findOne({ userId: parentId });
      if (!parentWallet) {
        parentWallet = new VirtualWallet({ userId: parentId, balance: 0 });
      }

      parentWallet.balance += bonusAmount;
      await parentWallet.save();

      await WalletTransaction.create({
        userId: parentId,
        type: "Referral Bonus",
        amount: bonusAmount,
        balanceAfter: parentWallet.balance,
        description: `Level ${i + 1} referral bonus from ${req.user.mobile}`,
      });
      // ✅ Track in referral earning log
  await ReferralEarningLog.create({
    earnedBy: parentId,
    fromUser: userId,
    level: i + 1,
    amount: bonusAmount,
    reason: "Investment Referral",
  });
    }

    res.status(201).json({
      message: "Investment successful",
      investment: newInvestment,
    });
  } catch (err) {
    console.error("❌ Investment error:", err);
    res.status(500).json({ message: "Investment error", error: err.message });
  }
};

exports.getMyActiveInvestments = async (req, res) => {
  try {
    const userId = req.user._id;

    const investments = await UserInvestment.find({ userId, isCompleted: false })
      .populate("planId", "name roi") // Get plan name + roi
      .sort({ startDate: -1 });

    const result = investments.map((inv) => {
      const earnedTillNow = inv.earnedTillNow || inv.amount; // fallback to original amount
      const principal = inv.amount;
      const roi = inv.roi;

      return {
        _id: inv._id,
        planName: inv.planId?.name || "N/A",
        investedAmount: principal,
        roi,
        currentAmount: parseFloat(earnedTillNow.toFixed(2)), // ✅ Total compounded amount
        earning: parseFloat((earnedTillNow - principal).toFixed(2)), // ✅ ROI earned = total - invested
        startDate: inv.startDate,
        isCompleted: inv.isCompleted,
      };
    });

    res.status(200).json({ investments: result });
  } catch (err) {
    res.status(500).json({ message: "Error fetching investments", error: err.message });
  }
};


// ✅ Admin: View All Investments (With User & Plan Info)
exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await UserInvestment.find()
      .populate("userId", "name mobile profilePic")
      .populate("planId", "name createdAt amount")
      .sort({ createdAt: -1 });

    res.status(200).json({ investments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching investments", error: err.message });
  }
};

// ✅ Admin: Grouped Investors Summary
exports.getAllInvestors = async (req, res) => {
  try {
    const grouped = await UserInvestment.aggregate([
      {
        $group: {
          _id: "$userId",
          totalInvested: { $sum: "$amount" },
          joinDate: { $min: "$startDate" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          mobile: "$user.mobile",
          profilePic: "$user.profilePic",
          totalInvested: 1,
          joinDate: 1,
          status: {
            $cond: [{ $eq: ["$user.role", "user"] }, "Active", "Inactive"],
          },
        },
      },
      { $sort: { joinDate: -1 } },
    ]);

    res.status(200).json({ investors: grouped });
  } catch (err) {
    res.status(500).json({ message: "Error fetching investors", error: err.message });
  }
};

exports.withdrawRoiAndExit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const investment = await UserInvestment.findById(id);
    if (!investment || investment.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Investment not found or unauthorized" });
    }

    const roiToWithdraw = investment.earnedTillNow || 0;
    if (roiToWithdraw <= 0) {
      return res.status(400).json({ message: "No ROI available to withdraw" });
    }

    const wallet = await VirtualWallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // 👇 Add safety parseFloat to avoid NaN
    wallet.balance = parseFloat((wallet.balance + roiToWithdraw).toFixed(2));
    await wallet.save();

    investment.earnedTillNow = 0;
    investment.isCompleted = true;
    investment.endDate = new Date();
    await investment.save();

    const txn = new WalletTransaction({
      userId,
      type: "ROI Withdraw & Exit",
      amount: roiToWithdraw,
      balanceAfter: wallet.balance,
      walletID: wallet.walletID || "N/A",
      description: `Exited investment ${investment._id} and withdrew ROI`,
    });

    await txn.save();

    // ✅ Ensure success response is not skipped
    return res.status(200).json({
      message: "Investment exited and ROI credited",
      amount: roiToWithdraw,
      newWalletBalance: wallet.balance,
    });
  } catch (err) {
    console.error("❌ Exit Error:", err); // Full error, not just message
    return res.status(500).json({
      message: "Error exiting investment",
      error: err.message || "Unknown server error",
    });
  }
};


// ✅ Preview Compound ROI (Client-side view)
exports.previewCompoundROI = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const investment = await UserInvestment.findById(id);
    if (!investment || investment.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Investment not found or unauthorized" });
    }

    const principal = investment.amount;
    const roi = investment.roi;
    const startDate = new Date(investment.startDate);
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

    if (daysPassed <= 0) {
      return res.status(200).json({
        principal,
        roi,
        daysPassed,
        earning: 0,
        finalAmount: principal,
      });
    }

    const finalAmount = principal * Math.pow(1 + roi / 100, daysPassed);
    const earning = finalAmount - principal;

    res.status(200).json({
      principal: parseFloat(principal.toFixed(2)),
      roi,
      daysPassed,
      earning: parseFloat(earning.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ message: "Error calculating ROI", error: err.message });
  }
};
