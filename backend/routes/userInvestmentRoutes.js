const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/userInvestmentController");
const { verifyToken: auth } = require("../middlewares/authMiddleware");

router.post("/invest", auth, investmentController.investInPlan);
router.get("/investments", auth, investmentController.getAllInvestors);
router.get("/all-investments", auth, investmentController.getAllInvestments);
router.get("/my-investments", auth, investmentController.getMyActiveInvestments);

router.post("/investments/:id/withdraw-roi", auth, investmentController.withdrawRoiAndExit);
router.get("/investments/:id/roi-preview", auth, investmentController.previewCompoundROI);
router.post("/investments/:id/withdraw-partial", auth, investmentController.withdrawPartialROI);


module.exports = router;
