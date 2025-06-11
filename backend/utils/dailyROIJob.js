const cron = require("node-cron");
const UserInvestment = require("../models/UserInvestment");

// Run daily at 12:01 AM
cron.schedule("1 0 * * *", async () => {
  console.log("📈 Running compound ROI update...");

  try {
    const investments = await UserInvestment.find({ isCompleted: false });

    for (let invest of investments) {
      try {
        const { amount: principal, roi, startDate } = invest;
        const now = new Date();
        const daysPassed = Math.floor((now - new Date(startDate)) / (1000 * 60 * 60 * 24));

        if (daysPassed <= 0) continue;

        const finalAmount = principal * Math.pow(1 + roi / 100, daysPassed);
        const earned = parseFloat((finalAmount - principal).toFixed(2));

        // Update if field exists
        if ('earnedTillNow' in invest) {
          invest.earnedTillNow = earned;
          await invest.save();
        } else {
          console.warn(`⚠️ Skipped: earnedTillNow not in schema for investment ${invest._id}`);
        }

      } catch (err) {
        console.error(`❌ Error processing investment ${invest._id}:`, err.message);
      }
    }

    console.log("✅ Virtual compound earnings updated.");
  } catch (error) {
    console.error("❌ Cron job failed:", error.message);
  }
});
