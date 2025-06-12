const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("./utils/dailyROIJob");
require("events").EventEmitter.defaultMaxListeners = 20;


const app = express();

// ✅ Enhanced CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "https://apart-x.pro",
      "http://localhost:5173",
      "https://qs3rfs46-5000.inc1.devtunnels.ms",
      "https://qs3rfs46-5173.inc1.devtunnels.ms",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// ✅ JSON Parser
app.use(express.json());

// ✅ Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve static files
app.use("/uploads", express.static(uploadsDir));

app.use((err, req, res, next) => {
  if (err.code === "ENOENT") {
    console.error("File not found:", req.path);
    return res.status(404).json({ message: "File not found" });
  }
  next(err);
});

// ✅ Health Check Route
app.get("/", (req, res) => res.send("API is running..."));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const sendCurrencyRoutes = require("./routes/sendCurrencyRoutes");
const receiveCurrencyRoutes = require("./routes/receiveCurrencyRoutes");
const investmentRoutes = require("./routes/investmentPlanRoutes");
const walletRoutes = require("./routes/walletRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const referralRoutes = require("./routes/referralRoutes");
const userInvestmentRoutes = require("./routes/userInvestmentRoutes"); // path as per your structure

app.use("/api", userInvestmentRoutes); // Keep this first
app.use("/api", referralRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", walletRoutes);
app.use("/api", authRoutes);
app.use("/api", sendCurrencyRoutes);
app.use("/api", receiveCurrencyRoutes);
app.use("/api", investmentRoutes);
app.use("/api", walletRoutes);

// Add this after all routes
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!", error: err.message });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
