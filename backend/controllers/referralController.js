const Refertree = require("../models/ReferralTree");
const User = require("../models/User");

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

    // Step 1: Find all entries in referral tree where the current user is the root in `path`
    const downline = await Refertree.find({ path: userId, level: { $lte: 3 } })
      .populate("userId", "name email mobile referralCode")
      .populate("parentId", "referralCode") // optional: to trace referral chain
      .sort({ level: 1 });

    const formatted = downline.map((entry) => ({
      treeRoot: userId,
      level: entry.level,
      joinedAt: entry.joinedAt,
      user: entry.userId, // includes name, email, mobile, referralCode
      parentReferralCode: entry.parentId?.referralCode || null,
    }));

    return res.status(200).json({
      rootUser: userId,
      totalDownline: formatted.length,
      downline: formatted,
    });
  } catch (err) {
    console.error("❌ Referral Tree Fetch Error:", err);
    return res.status(500).json({ message: "Error fetching referral tree", error: err.message });
  }
};
