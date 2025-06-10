const Refertree = require("../models/ReferralTree");


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


// GET /api/referrals/me
const User = require("../models/User");
exports.getReferredUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's referralCode
    const currentUser = await User.findById(userId);
if (!currentUser) return res.status(404).json({ message: "User not found" });

const referralCode = currentUser.referralCode;


    // Find users referred by this code
    const referredUsers = await User.find({ referredBy: referralCode }).select("_id mobile email");

    // Now get joinedAt from refertree for each user
    const userIds = referredUsers.map((u) => u._id);
    const refTreeEntries = await Refertree.find({ userId: { $in: userIds } }).select("userId joinedAt");

    // Map joinedAt to user data
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
