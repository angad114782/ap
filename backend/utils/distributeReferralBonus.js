const ReferralTree = require("../models/ReferralTree");
const ReferralEarningLog = require("../models/ReferralEarningLog");

module.exports = async function distributeReferralBonus(fromUserId, totalAmount) {
  try {
    const tree = await ReferralTree.findOne({ userId: fromUserId });
    if (!tree?.path || tree.path.length === 0) return;

    // Loop only top 3 levels: A, B, C
    for (let i = 0; i < tree.path.length && i < 3; i++) {
      const uplineId = tree.path[i];
      const level = i + 1;

      let percent = 0;
      if (level === 1) percent = 10;   // Level A → 10%
      else if (level === 2) percent = 5;  // Level B → 5%
      else if (level === 3) percent = 2;  // Level C → 2%

      const bonusAmount = (totalAmount * percent) / 100;

      const log = new ReferralEarningLog({
        earnedBy: uplineId,
        fromUser: fromUserId,
        level,
        amount: bonusAmount,
        reason: "Investment Referral"
      });

      await log.save();
    }
  } catch (err) {
    console.error("❌ Referral Bonus Distribution Failed:", err);
  }
};
