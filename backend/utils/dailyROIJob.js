const cron = require("node-cron");
const UserInvestment = require("../models/UserInvestment");

// Run daily at 12:01 AM
cron.schedule("1 0 * * *", async () => {
  console.log("📈 Running compound ROI update...");

  const investments = await UserInvestment.find({ isCompleted: false });

  for (let invest of investments) {
    const { amount: principal, roi, startDate } = invest;

    const now = new Date();
    const daysPassed = Math.floor((now - new Date(startDate)) / (1000 * 60 * 60 * 24));

    if (daysPassed <= 0) continue;

    // Compound interest formula
    const finalAmount = principal * Math.pow(1 + roi / 100, daysPassed);
    const earned = parseFloat((finalAmount - principal).toFixed(2));

    // Update only earnedTillNow (virtual earning)
    invest.earnedTillNow = earned;
    await invest.save();
  }

  console.log("✅ Virtual compound earnings updated (not credited to wallet).");
});
