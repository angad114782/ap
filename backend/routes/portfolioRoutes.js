const express = require("express");
const router = express.Router();
const { getMyPortfolio } = require("../controllers/portfolioController");
const { verifyToken: auth }  = require("../middlewares/authMiddleware"); // ✅ this must be added

router.get("/portfolio", auth, getMyPortfolio);

module.exports = router;
