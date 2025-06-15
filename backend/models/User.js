const mongoose = require("mongoose");
require("./ReferralEarningLog");

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true, // this user's own code
  },
  referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: function () {
    return this.role !== "admin";
  },
},


  name: String,
  email: {
  type: String,
  required: true, // ✅ force email to be required
  unique: true,
},
resetOTP: { type: String },
resetOTPExpiry: { type: Date },

  profilePic: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  mpin: String,
  deviceId: String, // for device-specific MPIN
}
,
  { timestamps: true } );

module.exports = mongoose.model("User", userSchema);
