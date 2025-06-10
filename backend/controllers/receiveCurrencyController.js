const ReceiveCurrency = require("../models/ReceiveCurrency");
const User = require("../models/User");
const VirtualWallet = require("../models/VirtualWallet");
const WalletTransaction = require("../models/WalletTransaction");
const UserWallet = require("../models/UserWallet");



exports.createReceiveCurrency = async (req, res) => {
  try {
    const { amount, wallet, walletID } = req.body;

    if (!amount || !wallet || !walletID) {
      return res
        .status(400)
        .json({ message: "Amount, wallet, and walletID are required." });
    }

    const walletInfo = await UserWallet.findById(walletID);
    if (!walletInfo) {
      return res
        .status(404)
        .json({ message: "Wallet not found with the provided walletID." });
    }

    // ✅ Fetch user's virtual wallet
    const userWallet = await VirtualWallet.findOne({ userId: req.user._id });
    if (!userWallet) {
      return res
        .status(404)
        .json({ message: "Virtual wallet not found for user." });
    }

    // ✅ Check if user has enough balance
    if (userWallet.balance < amount) {
      return res.status(400).json({
        message: `Insufficient wallet balance. Available: ${userWallet.balance}`,
      });
    }

    // ✅ Save receive request
    const newReceive = new ReceiveCurrency({
      userId: req.user?._id,
      amount,
      wallet,
      walletID,
      walletQrImage: walletInfo.qrImage,
    });

    await newReceive.save();

    return res.status(201).json({
      message: "Receive request submitted",
      data: newReceive,
    });
  } catch (err) {
    console.error("Receive API Error:", err);
    return res.status(500).json({ message: "Error", error: err.message });
  }
};

exports.getAllReceiveRequests = async (req, res) => {
  try {
    const receiveRequests = await ReceiveCurrency.find()
      .populate("userId", "name email mobile profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: receiveRequests });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: err.message });
  }
};

exports.updateReceiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    if (!id || !["Approved", "Disapproved", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status or ID" });
    }

    const withdrawRequest = await ReceiveCurrency.findById(id);
    if (!withdrawRequest)
      return res.status(404).json({ message: "Withdraw request not found" });

    const user = await User.findById(withdrawRequest.userId);
    if (!user)
      return res.status(400).json({ message: "Associated user not found" });

    withdrawRequest.status = status;
    if (remark) withdrawRequest.remark = remark;

    if (status === "Approved") {
      try {
        const amount = parseFloat(withdrawRequest.amount);
        if (isNaN(amount)) throw new Error("Invalid amount value");

        // ✅ Find or create user's virtual wallet
        let virtualWallet = await VirtualWallet.findOne({ userId: user._id });
        if (!virtualWallet) {
          return res.status(400).json({
            message: "User does not have a virtual wallet."
          });
        }

        if (virtualWallet.balance < amount) {
          return res.status(400).json({
            message: "Insufficient balance in virtual wallet."
          });
        }

        virtualWallet.balance -= amount;
        await virtualWallet.save();

        const walletTransaction = new WalletTransaction({
          userId: user._id,
          type: "Withdrawal",
          amount,
          balanceAfter: virtualWallet.balance,
          walletID: withdrawRequest.walletID,
          description: `Withdrawal approved to ${withdrawRequest.wallet}`,
        });

        await walletTransaction.save();
      } catch (walletErr) {
        console.error("Virtual wallet withdrawal error:", walletErr);
        return res.status(500).json({
          message: "Failed to process withdrawal",
          error: walletErr.message,
        });
      }
    }

    await withdrawRequest.save();
    return res.status(200).json({
      success: true,
      message: `Withdraw ${status.toLowerCase()} successfully`,
      data: withdrawRequest,
    });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update withdraw status",
      error: err.message,
    });
  }
};


exports.getReceiveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const receive = await ReceiveCurrency.findById(id).populate(
      "userId",
      "name email mobile"
    );

    if (!receive) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ data: receive });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching request", error: err.message });
  }
};
