const WalletTransaction = require("../models/WalletTransaction");

exports.logTransaction = async ({ userId, type, amount, walletID, balanceAfter, description = "" }) => {
  await WalletTransaction.create({
    userId,
    type,
    amount,
    walletID,
    balanceAfter,
    description
  });
};
