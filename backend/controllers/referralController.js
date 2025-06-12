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
    console.log("✅ Authenticated userId:", userId);

    // Step 1: Fetch referred users
    const referredUsers = await User.find({ referredBy: userId }).select("_id mobile email name");
    console.log("📦 Referred Users Found:", referredUsers.length);

    // Step 2: If none found, return early
    if (referredUsers.length === 0) {
      return res.status(200).json({ referred: [] });
    }

    // Step 3: Extract user IDs
    const userIds = referredUsers.map((u) => u._id);
    console.log("🧾 Referred user IDs:", userIds);

    // Step 4: Fetch from referral tree
    const refTreeEntries = await Refertree.find({ userId: { $in: userIds } }).select("userId joinedAt");
    console.log("🌲 Referral tree entries:", refTreeEntries.length);

    const joinedMap = {};
    refTreeEntries.forEach((entry) => {
      joinedMap[entry.userId.toString()] = entry.joinedAt;
    });

    // Step 5: Combine data
    const finalReferred = referredUsers.map((user) => ({
      mobile: user.mobile,
      name: user.name || user.email || "N/A",
      joinedAt: joinedMap[user._id.toString()] || null,
    }));

    return res.status(200).json({ referred: finalReferred });

  } catch (err) {
  console.error("❌ Referral Fetch Error:", err); // 👈 log full error
  console.error("❌ Stack Trace:", err.stack);    // 👈 log stack trace
  res.status(500).json({ message: "Server error", error: err.message });
}
};

