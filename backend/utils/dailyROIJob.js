const cron = require("node-cron");
const UserInvestment = require("../models/UserInvestment");

cron.schedule("50 59 23 * * *", async () => {
  // console.log("📈 Running daily compounding update at 11:59:50 (50 59 23) PM");

  try {
    const investments = await UserInvestment.find({ isCompleted: false });

    for (let invest of investments) {
      try {
        const { amount, roi, earnedTillNow } = invest;

        const base = earnedTillNow > 0 ? earnedTillNow : amount;
        const updatedTotal = parseFloat((base * (1 + roi / 100)).toFixed(2));

        invest.earnedTillNow = updatedTotal;
        await invest.save();

        // console.log(`✅ ${invest._id} | Total with ROI: ₹${updatedTotal}`);
      } catch (err) {
        console.error(`❌ Error on ${invest._id}:`, err.message);
      }
    }

    console.log("✅ Daily compounding complete.");
  } catch (err) {
    console.error("❌ Cron failed:", err.message);
  }
}, {
  timezone: "Asia/Kolkata"
});
