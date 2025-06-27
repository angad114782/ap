const User = require("../models/User");
const bcrypt = require("bcryptjs");
const ReferralTree = require("../models/ReferralTree");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const OtpVerification = require("../models/OtpVerification");
const Investment = require("../models/UserInvestment");
const Plan = require("../models/InvestmentPlan");

// Generate new referral code based on mobile
const generateReferralCode = (mobile) => {
  return "REF" + mobile.slice(-4) + Math.floor(1000 + Math.random() * 9000);
};

// controllers/authController.js


exports.sendRegisterOtp = async (req, res) => {
  try {
    const { mobile, email, password, referralCode, deviceId } = req.body;

    if (!mobile || !email || !password || !referralCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(409).json({ message: "Mobile already registered" });
    }

    // ✅ Validate referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(400).json({ message: "Invalid referral code" });
    }

    // ✅ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Remove old OTPs for this email (cleanup)
    await OtpVerification.deleteMany({ email, type: "registration" });

    // ✅ Store OTP and registration data
    await OtpVerification.create({
      email,
      otp,
      type: "registration",
      data: {
        mobile,
        password,
        email,
        referralCode,
        referredBy: referrer._id,
        deviceId,
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Apart-X" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Your Registration OTP - Apart-X",
        html: `
      <p>Hello,</p>
      <p>Your OTP to complete registration is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>Please do not share it with anyone.</p>
      <br/>
      <p>Regards,<br/>Team Apart-X</p>
    `,
      });

      console.log(`✅ Registration OTP sent to ${email}: ${otp}`);
      return res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
      console.error("Registration OTP Error:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }




  } catch (err) {
    console.error("OTP Send Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingOtp = await OtpVerification.findOne({ email, type: "registration" });
    if (!existingOtp) {
      return res.status(404).json({ message: "No registration in progress" });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    existingOtp.otp = newOtp;
    existingOtp.createdAt = new Date();
    existingOtp.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await existingOtp.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Apart-X" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Resent OTP - Apart-X",
      html: `
        <p>Hello again,</p>
        <p>Your new OTP is:</p>
        <h2>${newOtp}</h2>
        <p>Valid for 10 minutes.</p>
        <br/>
        <p>Regards,<br/>Team Apart-X</p>
      `,
    });

    return res.status(200).json({ message: "New OTP sent to your email" });

  } catch (err) {
    console.error("Resend OTP Error:", err);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
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
      referredBy: referrer?._id || null, // ✅ FIXED HERE
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
      return res.status(400).json({
        message: "Mobile, password, and deviceId are required",
      });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Check if user is inactive
    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "Your account is deactivated. Please contact support or admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      profilePic: user.profilePic,
      name: user.name,
      email: user.email,
      token,
      role: user.role,
      userId: user._id,
      deviceId: user.deviceId,
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
          fs.promises
            .unlink(req.file.path)
            .catch((err) =>
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP & expiry (15 min)
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send OTP via email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // typically: mail.yourdomain.com
      port: 465,                // 465 for SSL, or 587 for TLS
      secure: true,             // true for 465, false for 587
      auth: {
        user: process.env.SMTP_EMAIL,    // e.g., support@apart-x.pro
        pass: process.env.SMTP_PASSWORD, // your email password (or app password if enabled)
      },
    });


    await transporter.sendMail({
      from: `"Apart-X" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Reset Your Password - Apart-X",
      html: `<p>Your OTP to reset password is:</p>
             <h2>${otp}</h2>
             <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Case 1: Logged-in user wants to change password using oldPassword
    if (req.user && oldPassword) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }

    // Case 2: Reset via OTP (email provided but not logged in)
    if (email && newPassword) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Optional: You may check if OTP was verified recently
      // If OTP system clears OTP after verification, skip this check

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return res.status(200).json({ message: "Password reset successfully" });
    }

    return res.status(400).json({ message: "Invalid request format" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


exports.regOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;
    const existing = await OtpVerification.findOne({ email, otp, type });

    if (!existing) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (type === "registration") {
      const { mobile, password, referralCode, referredBy } = existing.data;

      const hashedPassword = await bcrypt.hash(password, 10);
      const referralCodeNew = generateReferralCode(mobile);

      const newUser = await User.create({
        mobile,
        password: hashedPassword,
        referralCode: referralCodeNew,
        referredBy,
        email,
        role: "user",
      });

      await ReferralTree.create({
        userId: newUser._id,
        parentId: referredBy,
        level: 2,
        path: [referredBy],
      });

      await existing.deleteOne(); // Clean up used OTP

      return res.status(200).json({ message: "OTP verified, user registered" });
    }

    // handle other OTP types...
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.resetOTP ||
      user.resetOTP !== otp ||
      new Date(user.resetOTPExpiry) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    console.log(`✅ OTP verified for ${email} [Type: ${type}]`);

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();

    const investments = await Investment.find().populate("planId").lean();

    const uplines = await User.find({
      _id: { $in: users.map(u => u.referredBy).filter(Boolean) }
    }).lean();

    const refMap = {};
    uplines.forEach(u => {
      refMap[u._id.toString()] = u.name || u.email;
    });

    const investmentMap = {};
    for (const inv of investments) {
      const uid = inv.userId.toString();
      if (!investmentMap[uid]) investmentMap[uid] = [];

      investmentMap[uid].push({
  plan: inv.planId?.name || "Unknown", // Plan name from populated planId
  amount: inv.amount || 0,
});
    }

    const investors = users.map((u) => {
      const userId = u._id.toString();
      const userInvestments = investmentMap[userId] || [];

      const totalInvestedAmount = userInvestments.reduce(
        (sum, inv) => sum + inv.amount,
        0
      );

      // Only keep unique plans
      const uniquePlans = [...new Set(userInvestments.map(inv => inv.plan))];

      return {
        id: userId,
        name: u.name || u.email,
        mobile: u.mobile,
        profilePic: u.profilePic,
        joinDate: u.createdAt,
        referralCode: u.referralCode || "N/A",
        referredBy: refMap[u.referredBy?.toString()] || "N/A",
        investments: uniquePlans,
        totalInvested: totalInvestedAmount,
        status: u.status || "Active",
      };
    });

    res.json({ investors });
  } catch (err) {
    console.error("Get All Users Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Status update error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select("-password") // Exclude password
      .populate("referredBy", "name email mobile"); // Show name/email of upline

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("referredBy", "name mobile email"); // Brings upliner data

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
      profilePic: user.profilePic,
      referredBy: user.referredBy
        ? {
          name: user.referredBy.name,
          mobile: user.referredBy.mobile,
          email: user.referredBy.email,
        }
        : null,
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


