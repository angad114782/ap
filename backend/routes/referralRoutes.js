const express = require("express");
const router = express.Router();

const { verifyToken: auth} = require("../middlewares/authMiddleware");
const { getMyReferrals, getReferredUsers, getMyReferralTree, getAllReferralHistory } = require("../controllers/referralController");

const isAdmin = require("../middlewares/isAdmin");

router.get("/referrals", auth, getMyReferrals);
router.get("/referrals/me", auth, getReferredUsers);
router.get("/my-referral-tree", auth, getMyReferralTree);
router.get("/admin/referral-history", auth, isAdmin, getAllReferralHistory);


module.exports = router;
