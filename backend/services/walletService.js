// services/walletService.js
const VirtualWallet = require("../models/VirtualWallet");

exports.credit = async (userId, amount) => {
  if (amount <= 0) throw new Error("Amount must be positive");

  const wallet = await VirtualWallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { new: true, upsert: true } // ✅ creates wallet if missing
  );
  return wallet;
};

exports.debit = async (userId, amount) => {
  if (amount <= 0) throw new Error("Amount must be positive");

  const wallet = await VirtualWallet.findOne({ userId });
  if (!wallet || wallet.balance < amount)
    throw new Error("Insufficient wallet balance");

  wallet.balance -= amount;
  return wallet.save();
};
