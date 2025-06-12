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
    console.log("✅ API Called by userId:", userId);

    const referredUsers = await User.find({ referredBy: userId }).select("_id mobile email name referredBy");
    console.log("📦 Referred Users Found:", referredUsers.length);

    if (referredUsers.length === 0) {
      console.log("❕ No referred users found");
      return res.status(200).json({ referred: [] });
    }

    const userIds = referredUsers.map((u) => u._id);
    console.log("🧾 Referred user IDs:", userIds);

    const refTreeEntries = await Refertree.find({ userId: { $in: userIds } }).select("userId joinedAt");
    console.log("🌲 Referral tree entries:", refTreeEntries.length);

    const joinedMap = {};
    refTreeEntries.forEach((entry) => {
      joinedMap[entry.userId.toString()] = entry.joinedAt;
    });

    const finalReferred = referredUsers.map((user) => ({
      mobile: user.mobile,
      name: user.name || user.email || "N/A",
      joinedAt: joinedMap[user._id.toString()] || null,
    }));

    console.log("✅ Final response:", finalReferred);

    return res.status(200).json({ referred: finalReferred });

  } catch (err) {
    console.error("❌ Referral Fetch Error:", err); // FULL STACK
    return res.status(500).json({ message: "Referral fetch failed", error: err.message, stack: err.stack });
  }
};

