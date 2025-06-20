const cron = require("node-cron");
const UserInvestment = require("../models/UserInvestment");

cron.schedule(
  "50 59 23 * * *",
  async () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const dayOfWeek = now.getDay(); // Sunday = 0, Saturday = 6

    // Skip Saturdays and Sundays
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // console.log("⛔ Market closed: Skipping compounding on weekend.");
      return;
    }

    // console.log("📈 Running daily compounding update at 11:59:50 PM");

    try {
      const investments = await UserInvestment.find({ isCompleted: false });

      for (let invest of investments) {
        try {
          if (invest.lastUpdated === today) {
            // console.log(`⏩ Already updated today: ${invest._id}`);
            continue;
          }

          const { amount, roi, earnedTillNow } = invest;

          const base = earnedTillNow > 0 ? earnedTillNow : amount;
          const updatedTotal = parseFloat((base * (1 + roi / 100)).toFixed(2));

          invest.earnedTillNow = updatedTotal;
          invest.lastUpdated = today;
          await invest.save();

          // console.log(`✅ Compounded: ${invest._id} | New Total: ₹${updatedTotal}`);
        } catch (err) {
          console.error(`❌ Error processing ${invest._id}:`, err.message);
        }
      }

      console.log("✅ Daily compounding complete.");
    } catch (err) {
      console.error("❌ Cron failed:", err.message);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
