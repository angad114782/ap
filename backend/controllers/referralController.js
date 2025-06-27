const Refertree = require("../models/ReferralTree");
const User = require("../models/User");
const ReferralEarningLog = require("../models/ReferralEarningLog");

exports.getMyReferrals = async (req, res) => {
  try {
    const userId = req.user._id;

    const downline = await Refertree.find({ path: userId })
      .populate("userId", "name email mobile")
      .sort({ level: 1 });

    res.status(200).json({ tree: downline });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

exports.getReferredUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("✅ Authenticated userId:", userId);

    // Step 1: Fetch referred users
    const referredUsers = await User.find({ referredBy: userId }).select("_id mobile email name referredBy");
    console.log("📦 Referred Users Found:", referredUsers.length);

    if (referredUsers.length === 0) {
      return res.status(200).json({ referred: [] });
    }

    const userIds = referredUsers.map((u) => u._id);
    console.log("🧠 User IDs:", userIds);

    const refTreeEntries = await Refertree.find({ userId: { $in: userIds } }).select("userId joinedAt");
    console.log("🌱 Referral Tree Entries:", refTreeEntries.length);

    const joinedMap = {};
    refTreeEntries.forEach((entry) => {
      if (!entry?.userId) {
        console.warn("⚠️ Invalid entry in ReferralTree:", entry);
      } else {
        joinedMap[entry.userId.toString()] = entry.joinedAt;
      }
    });

    const finalReferred = referredUsers.map((user) => ({
      mobile: user.mobile,
      name: user.name || user.email || "N/A",
      joinedAt: joinedMap[user._id.toString()] || null,
    }));

    res.status(200).json({ referred: finalReferred });

  } catch (err) {
    console.error("❌ Fetch referred users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getMyReferralTree = async (req, res) => {
  try {
    const userId = req.user._id;
    const maxDepth = 3;

    let currentLevel = 0;
    let queue = [userId]; // start with root
    let visited = new Set(); // prevent loops
    const downlineUsers = [];

    while (queue.length > 0 && currentLevel < maxDepth) {
      const nextQueue = [];

      for (const parentId of queue) {
        const children = await Refertree.find({ parentId })
          .populate("userId", "name email mobile referralCode")
          .populate("parentId", "referralCode")
          .lean();

        for (const child of children) {
          const downlineUserId = child.userId?._id?.toString();
          if (!downlineUserId || visited.has(downlineUserId)) continue;

          // ✅ Check if you (userId) earned referral bonus from this child
          const bonusLog = await ReferralEarningLog.findOne({
            earnedBy: userId,
            fromUser: downlineUserId,
            reason: "Investment Referral",
          });

          downlineUsers.push({
            level: currentLevel + 1,
            user: child.userId,
            joinedAt: child.joinedAt,
            parentReferralCode: child.parentId?.referralCode || null,
            bonusEarned: bonusLog?.amount || 0, // 💰 Bonus added
          });

          nextQueue.push(downlineUserId);
          visited.add(downlineUserId);
        }
      }

      queue = nextQueue;
      currentLevel++;
    }

    return res.status(200).json({
      rootUser: userId,
      totalDownline: downlineUsers.length,
      downline: downlineUsers,
    });

  } catch (err) {
    console.error("❌ Referral Tree Fetch Error:", err);
    return res.status(500).json({ message: "Error fetching referral tree", error: err.message });
  }
};


exports.getAllReferralHistory = async (req, res) => {
  try {
  const allUsers = await User.find({ role: { $ne: "admin" } })
      .select("_id name email mobile profilePic referralCode referredBy")
      .populate({ path: "referredBy", select: "name referralCode profilePic email mobile" })
      .sort({ _id: -1 }); // latest first

    const allHistories = await Promise.all(
      allUsers.map(async (user) => {
        const treeEntry = await Refertree.findOne({ userId: user._id });

        // ✅ Fix: Get total earnings *received* by this user from referral logs
        const referralLogs = await ReferralEarningLog.find({
  earnedBy: user._id, // ✅ Correct field name
  reason: "Investment Referral",
});

        const totalEarnings = referralLogs.reduce((sum, log) => sum + (log.amount || 0), 0);

        const downlines = await User.find({ referredBy: user._id }).select("name mobile referralCode profilePic email");

        return {
          user,
          referredBy: user.referredBy || null,
          bonusEarned: totalEarnings,
          joinedAt: treeEntry?.joinedAt || null,
          downlines,
        };
      })
    );

    return res.status(200).json({ downline: allHistories });
  } catch (err) {
    console.error("❌ Error in admin referral history:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
