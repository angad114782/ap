const ReferralTree = require("../models/ReferralTree");
const UserInvestment = require("../models/UserInvestment");
const RewardMilestone = require("../models/RewardMilestone");
const VirtualWallet = require("../models/VirtualWallet");
const WalletTransaction = require("../models/WalletTransaction");

// Milestone slab definitions (sorted ascending)
const MILESTONES = [1000, 2500, 5000, 10000, 25000, 50000];

exports.checkAndRewardMilestone = async (userId) => {
  try {
    // Step 1: Get total investment of the downline
    const totalInvestmentAgg = await UserInvestment.aggregate([
      { $match: { userId } },
      { $group: { _id: "$userId", total: { $sum: "$amount" } } },
    ]);
    const investedAmount = totalInvestmentAgg[0]?.total || 0;

    if (investedAmount < MILESTONES[0]) return; // No milestone reached yet

    // Step 2: Get referrer (upliner)
    const refTree = await ReferralTree.findOne({ userId });
    if (!refTree?.parentId) return;
    const uplinerId = refTree.parentId;

    // Step 3: Get upliner's wallet
    const wallet = await VirtualWallet.findOne({ userId: uplinerId });
    if (!wallet) return;

    // Step 4: Get all previously rewarded milestones for this downline
    const pastRewards = await RewardMilestone.find({
      userId: uplinerId,
      downlineId: userId,
    });

    const rewardedMilestones = pastRewards.map(r => r.milestone); // e.g., [1000, 2500]

    let lastRewardedValue = 0;

    // Step 5: Loop through milestones and reward unclaimed ones
    for (let milestone of MILESTONES) {
      const milestoneRewardValue = milestone * 0.10;

      if (rewardedMilestones.includes(milestone)) {
        // Update baseline for difference
        lastRewardedValue = milestoneRewardValue;
        continue;
      }

      if (investedAmount >= milestone) {
        const rewardToGive = milestoneRewardValue - lastRewardedValue;

        if (rewardToGive > 0) {
          // Step 6: Create reward entry
          await RewardMilestone.create({
            userId: uplinerId,
            downlineId: userId,
            milestone,
            rewardAmount: rewardToGive,
          });

          // Step 7: Update wallet balance
          wallet.balance += rewardToGive;
          await wallet.save();

          // Step 8: Log transaction in passbook
          await WalletTransaction.create({
            userId: uplinerId,
            type: "Milestone Reward",
            amount: rewardToGive,
            balanceAfter: wallet.balance,
            description: `Milestone reward for downline reaching ₹${milestone}.`,
          });

          // Update for next round
          lastRewardedValue = milestoneRewardValue;
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in checkAndRewardMilestone:", error);
  }
};
