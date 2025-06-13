const express = require("express");
const router = express.Router();
const { getMyReferrals, getReferredUsers, getMyReferralTree } = require("../controllers/referralController");

const { verifyToken: auth} = require("../middlewares/authMiddleware");


router.get("/referrals", auth, getMyReferrals);
router.get("/referrals/me", auth, getReferredUsers);
router.get("/my-referral-tree", auth, getMyReferralTree);


module.exports = router;
