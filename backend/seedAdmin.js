const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const mobile = "+919999999999";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await User.findOne({ mobile });
  if (existingAdmin) {
    console.log("✅ Admin already exists.");
    return process.exit();
  }

  const adminUser = new User({
    mobile,
    password: hashedPassword,
    referralCode: "ADMINREF9999",
    name: "Super Admin",
    email: "admin@example.com",
    role: "admin",
  });

  await adminUser.save();
  console.log("✅ Admin user created successfully.");
  process.exit();
};

seedAdmin();
