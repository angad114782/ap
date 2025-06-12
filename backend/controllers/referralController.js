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
    console.log("➡️ Referral API hit by:", userId);

    const referredUsers = await User.find({ referredBy: userId }).select("name mobile email _id");
    console.log("📌 Referred Users:", referredUsers.length);

    const userIds = referredUsers.map(u => u._id);
    console.log("🧾 User IDs:", userIds);

    const refData = await Refertree.find({ userId: { $in: userIds } }).select("userId joinedAt");
    console.log("🌲 Referral tree entries:", refData);

    const joinedMap = {};
    refData.forEach((entry) => {
      joinedMap[entry.userId.toString()] = entry.joinedAt;
    });

    const finalReferred = referredUsers.map((user) => ({
      mobile: user.mobile,
      name: user.name || user.email || "N/A",
      joinedAt: joinedMap[user._id.toString()] || null,
    }));

    console.log("✅ Final Response:", finalReferred);

    return res.status(200).json({ referred: finalReferred });
  } catch (err) {
    console.error("❌ Referral API Crash:", err.message);
    console.error(err.stack);
    return res.status(500).json({
      message: "Referral fetch failed",
      reason: err.message,
      stack: err.stack, // ⭐️ send full trace to frontend
    });
  }
};

