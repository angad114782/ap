const mongoose = require("mongoose");

const userWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ now required
    },
    walletID: {
      type: String,
      required: true,
      trim: true,
    },
    walletType: {
  type: String,
  required: true,
  enum: ["binance", "metamask", "coinbase", "trustwallet"],
  lowercase: true,
  trim: true,
},
    qrImage: {
      type: String,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual populate if needed later
// userWalletSchema.virtual("userDetails", {
//   ref: "User",
//   localField: "userId",
//   foreignField: "_id",
//   justOne: true
// });

module.exports = mongoose.model("UserWallet", userWalletSchema);
