const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/userInvestmentController");
const { verifyToken: auth } = require("../middlewares/authMiddleware");

router.post("/invest", auth, investmentController.investInPlan);
router.get("/investments", auth, investmentController.getAllInvestors);
router.get("/all-investments", auth, investmentController.getAllInvestments);
router.get("/my-investments", auth, investmentController.getMyActiveInvestments);

const { withdrawRoiAndExit,previewCompoundROI,withdrawPartialROI } = require("../controllers/userInvestmentController");
router.post("/investments/:id/withdraw-roi", auth, withdrawRoiAndExit);
router.get("/investments/:id/roi-preview", auth, previewCompoundROI);
router.post("/investments/:id/withdraw-Partial", auth, withdrawPartialROI);


module.exports = router;
