const SendCurrency = require("../models/SendCurrency");
const UserWallet = require("../models/UserWallet");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

const VirtualWallet = require("../models/VirtualWallet");

exports.createSendCurrency = async (req, res) => {
  try {
    const {
      amount,
      wallet,
      walletID,
      userActiveWalletID,
      userActiveWalletType,
    } = req.body;

    const screenshotFile = req.file;
    const userId = req.user?._id;

    // Required fields check
    if (
      !amount ||
      !wallet ||
      !walletID ||
      !screenshotFile ||
      !userActiveWalletID ||
      !userActiveWalletType
    ) {
      return res
        .status(400)
        .json({ message: "All fields including screenshot are required." });
    }

    // ✅ Check admin wallet only
    const adminActiveWallet = await UserWallet.findOne({
      walletType: wallet.toLowerCase().trim(),
      walletID: walletID,
      isActive: true,
    });

    if (!adminActiveWallet) {
      return res.status(400).json({
        message: `No admin active wallet found with ${walletID} and ${wallet}.`,
      });
    }

    // ✅ Check for duplicate pending request
    const existingPending = await SendCurrency.findOne({
      userId,
      wallet: wallet.toLowerCase(),
      walletID,
      status: "Pending",
    });

    if (existingPending) {
      return res.status(409).json({
        message:
          "You already have a pending request for this wallet. Please wait until it is approved or rejected.",
      });
    }

    // ✅ Save the request (screenshot already validated)
    const newSend = new SendCurrency({
      userId,
      amount,
      wallet: wallet.toLowerCase(),
      walletID,
      userActiveWalletID,
      userActiveWalletType: userActiveWalletType.toLowerCase(),
      screenshot: screenshotFile.filename,
    });

    await newSend.save();

    res.status(201).json({
      message: "Send request submitted successfully",
      data: newSend,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};


exports.getAllSendRequests = async (req, res) => {
  try {
    const requests = await SendCurrency.find()
      .populate("userId", "name email mobile profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: requests });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: err.message });
  }
};
exports.getAllSendRequestsRecent = async (req, res) => {
  try {
    const requests = await SendCurrency.find()
      .populate("userId", "name email mobile profilePic")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({ data: requests });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: err.message });
  }
};
exports.updateSendStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    if (!id) return res.status(400).json({ message: "Deposit ID is required" });
    if (!status || !["Approved", "Disapproved", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const depositRequest = await SendCurrency.findById(id);
    if (!depositRequest)
      return res.status(404).json({ message: "Deposit request not found" });

    const user = await User.findById(depositRequest.userId);
    if (!user) {
      return res.status(400).json({ message: "Associated user not found" });
    }

    depositRequest.status = status;
    if (remark) depositRequest.remark = remark;

    if (status === "Approved") {
      const amount = parseFloat(depositRequest.amount);
      if (isNaN(amount)) throw new Error("Invalid amount value");

      // ✅ Step 1: Credit to Virtual Wallet
      let virtualWallet = await VirtualWallet.findOne({ userId: user._id });
      if (!virtualWallet) {
        virtualWallet = new VirtualWallet({ userId: user._id, balance: 0 });
      }
      virtualWallet.balance += amount;
      await virtualWallet.save();

      // ✅ Step 2: Log deposit transaction
      const userTxn = new WalletTransaction({
        userId: user._id,
        type: "Deposit",
        amount,
        balanceAfter: virtualWallet.balance,
        walletID: depositRequest.walletID || "N/A",
        description: `Deposit approved via ${depositRequest.wallet}`,
      });
      await userTxn.save();
    }

    await depositRequest.save();

    return res.status(200).json({
      success: true,
      message: `Deposit ${status.toLowerCase()} successfully`,
      data: depositRequest,
    });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update deposit status",
      error: err.message,
    });
  }
};



exports.getSendRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const send = await SendCurrency.findById(id).populate(
      "userId",
      "name email mobile"
    );

    if (!send) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ data: send });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching request", error: err.message });
  }
};


