const express = require("express");
const router = express.Router();
const controller = require("../controllers/investmentPlanController");
const { verifyToken: auth } = require("../middlewares/authMiddleware");

const isAdmin = require("../middlewares/isAdmin");

router.post("/plans", controller.addPlan);
router.get("/plans", controller.getPlans);
router.put("/plans/:id", controller.updatePlan);
router.delete("/plans/:id", controller.deletePlan);
// router.patch("/plans/:id/toggle", controller.togglePlanStatus);
router.patch("/plans/:id/toggle", auth, isAdmin, controller.togglePlanStatus);


module.exports = router;
