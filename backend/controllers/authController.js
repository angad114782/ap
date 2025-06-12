const User = require("../models/User");
const bcrypt = require("bcryptjs");
const ReferralTree = require("../models/ReferralTree");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Generate new referral code based on mobile
const generateReferralCode = (mobile) => {
  return "REF" + mobile.slice(-4) + Math.floor(1000 + Math.random() * 9000);
};

exports.registerUser = async (req, res) => {
  try {
    const {
      mobile,
      password,
      referralCode: referrerCode,
      name,
      email,
      profilePic,
      role = "user",
    } = req.body;

    // ✅ Validate required fields
    if (!mobile || !password || !referrerCode || !email) {
      return res.status(400).json({
        message: "Mobile, password, referral code, and email are required.",
      });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(409).json({ message: "Mobile already registered." });
    }

    // ✅ Validate referral code for non-admins
    let referrer = null;
    if (role !== "admin") {
      referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code." });
      }
    }

    // ✅ Hash password & generate new referral code
    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = generateReferralCode(mobile);

    // ✅ Create user with correct referredBy as ObjectId
    const user = new User({
      mobile,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referrer?._id || null,  // ✅ FIXED HERE
      name,
      email,
      profilePic,
      role,
    });

    await user.save();

    // ✅ Create referral tree entry
    if (role !== "admin" && referrer) {
      const parentTree = await ReferralTree.findOne({ userId: referrer._id });

      const referralTreeEntry = new ReferralTree({
        userId: user._id,
        parentId: referrer._id,
        level: parentTree ? parentTree.level + 1 : 2,
        path: parentTree ? [...parentTree.path, referrer._id] : [referrer._id],
      });

      await referralTreeEntry.save();
    }

    return res.status(201).json({
      message: `${role} registered successfully.`,
      referralCode: newReferralCode,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { mobile, password, deviceId } = req.body;

    if (!mobile || !password || !deviceId) {
      return res
        .status(400)
        .json({ message: "Mobile, password, and deviceId are required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // const isMpinMissing = !user.mpin || !user.deviceId;
    // const isNewDevice = user.deviceId !== deviceId;

    // if (isMpinMissing || isNewDevice) {
    //   return res.status(200).json({
    //     message: "First time on device. MPIN required.",
    //     requireMpin: true,
    //     token,
    //     userId: user._id,
    //     role: user.role,
    //     redirectTo: user.role === "admin" ? "/admin" : "/main-screen",
    //   });
    // }

    return res.status(200).json({
      message: "Login successful",
      profilePic: user.profilePic,
      name: user.name,
      email: user.email,
      token,
      role: user.role,
      userId: user._id, // ✅ Add this
      deviceId: user.deviceId, // ✅ Optional: helpful for debug
      redirectTo: user.role === "admin" ? "/admin" : "/main-screen",
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.setMpin = async (req, res) => {
  try {
    const { userId, mpin, deviceId } = req.body;

    if (!userId || !mpin || !deviceId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.mpin = mpin;
    user.deviceId = deviceId;

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "MPIN set successfully. You can now login.",
      token,
      role: user.role,
      redirectTo: user.role === "admin" ? "/admin" : "/main-screen",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to set MPIN" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;


    
    // Handle profile picture upload
  if (req.file) {
  try {
    console.log("🟢 Received file:", req.file);

    const outputPath = path.join(
      __dirname,
      "../uploads/profile_pic",
      `resized-${req.file.filename}`
    );
    const publicPath = `/uploads/profile_pic/resized-${req.file.filename}`;

    // Ensure original file exists before sharp
    if (!fs.existsSync(req.file.path)) {
      console.error("❌ Uploaded file not found:", req.file.path);
      return res.status(400).json({ message: "Uploaded file is missing" });
    }

    // Try resizing
  await sharp(req.file.path)
  .resize(300, 300, {
    fit: "cover",
    position: "center",
  })
  .toFile(outputPath);

// ⚠️ Windows fix: wait briefly before unlink
setTimeout(() => {
  fs.promises.unlink(req.file.path).catch((err) =>
    console.error("File delete failed (delayed):", err)
  );
}, 100);


    user.profilePic = publicPath;
  } catch (error) {
    console.error("❌ Image processing error:", error.message);
    return res.status(500).json({
      message: "Error processing image",
      error: error.message,
    });
  }
}


    await user.save();

    // Construct the full URL for the profile picture
    const profilePicUrl = user.profilePic
      ? `${req.protocol}://${req.get("host")}${user.profilePic}`
      : null;

    res.status(200).json({
      message: "Profile updated successfully",
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profilePic: profilePicUrl,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

exports.getInvestorCount = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "name mobile email createdAt"
    );

    res.status(200).json({
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

const UserWallet = require("../models/UserWallet");

exports.getAllUserWallets = async (req, res) => {
  try {
    const wallets = await UserWallet.find().populate(
      "userId",
      "name mobile email"
    ); // ✅ short user details

    const data = wallets.map((w) => ({
      name: w.userId?.name || "N/A",
      mobile: w.userId?.mobile || "N/A",
      email: w.userId?.email || "N/A",
      walletID: w.walletID,
      walletType: w.walletType,
      balance: w.balance,
    }));

    res.status(200).json({ users: data });
  } catch (err) {
    console.error("Wallet Fetch Error:", err);
    res
      .status(500)
      .json({ message: "Error fetching wallets", error: err.message });
  }
};

exports.getMyWallet = async (req, res) => {
  try {
    const userId = req.user._id;

    const wallet = await UserWallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        message: "You haven't created a wallet yet. Please create one.",
      });
    }

    res.status(200).json({
      walletID: wallet.walletID,
      walletType: wallet.walletType,
      balance: wallet.balance,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    });
  } catch (err) {
    console.error("My Wallet Error:", err);
    res
      .status(500)
      .json({ message: "Error fetching wallet", error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { mobile, newPassword } = req.body;

    if (!mobile || !newPassword) {
      return res
        .status(400)
        .json({ message: "Mobile and new password required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const nodemailer = require("nodemailer");
const { profile } = require("console");

exports.sendOtpForReset = async (req, res) => {
  try {
    const { mobile } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otpCode = otp;
    user.otpExpiry = expiry;
    console.log("OTP Mail:", otp);
    await user.save();

    // ✅ SMTP Webmail Configuration
    const transporter = nodemailer.createTransport({
      host: "mail.hostinger.com", // replace with your mail server (e.g., smtp.zoho.com)
      port: 587, // or 465 if using SSL
      secure: false, // true if port 465
      auth: {
        user: "ankit@angadyadav.in", // your webmail email
        pass: "1y0XWO$y]S", // your webmail password
      },
    });

    await transporter.sendMail({
      from: '"Forget Password" <noreply@angadyadav.in>',
      to: user.email,
      subject: "Your OTP for Password Reset",
      html: `<p>Hello ${user.name || "User"},</p>
             <p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    return res
      .status(200)
      .json({ message: "OTP sent to your registered email." });
  } catch (err) {
    console.error("OTP Mail Error:", err);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    if (!mobile || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.otpCode ||
      user.otpCode !== otp ||
      new Date(user.otpExpiry) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

