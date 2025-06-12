const Refertree = require("../models/ReferralTree");
const User = require("../models/User"); // ✅ FIXED import



exports.getMyReferrals  = async (req, res) => {
  try {
    const userId = req.user._id;

    const downline = await ReferralTree.find({ path: userId })
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

    // 🔍 Log the userId (ObjectId) being used to match referred users
    console.log("🔗 Looking for users referred by userId:", userId);

    // ✅ Match users whose `referredBy` = current user's _id (ObjectId)
    const referredUsers = await User.find({ referredBy: userId }).select("_id mobile email name");

    const userIds = referredUsers.map((u) => u._id);
    const refTreeEntries = await Refertree.find({ userId: { $in: userIds } }).select("userId joinedAt");

    const joinedMap = {};
    refTreeEntries.forEach((entry) => {
      joinedMap[entry.userId.toString()] = entry.joinedAt;
    });

    const finalReferred = referredUsers.map((user) => ({
      mobile: user.mobile,
      name: user.name || user.email || "N/A",
      joinedAt: joinedMap[user._id.toString()] || null,
    }));

    res.status(200).json({ referred: finalReferred });
  } catch (err) {
    console.error("Fetch referred users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
