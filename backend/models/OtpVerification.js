const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  email: String,
  otp: String,
  type: String, // e.g., registration, forgot-password
  data: Object, // holds all user data for registration
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
