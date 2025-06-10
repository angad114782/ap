const InvestmentPlan = require("../models/InvestmentPlan");

// 🔸 Add Plan
exports.addPlan = async (req, res) => {
  try {
    const { name, minAmount, maxAmount, roi } = req.body;

    if (!name || !minAmount || !maxAmount || !roi ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newPlan = new InvestmentPlan({ name, minAmount, maxAmount, roi });
    await newPlan.save();

    res.status(201).json({ message: "Plan created", plan: newPlan });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// 🔸 Get All Plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await InvestmentPlan.find().sort({ createdAt: -1 });
    res.status(200).json({ plans });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// 🔸 Update Plan
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InvestmentPlan.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Plan not found" });

    res.status(200).json({ message: "Plan updated", plan: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating plan", error: err.message });
  }
};

// 🔸 Delete Plan
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InvestmentPlan.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Plan not found" });

    res.status(200).json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting plan", error: err.message });
  }
};

// 🔸 Toggle Active Status
exports.togglePlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await InvestmentPlan.findById(id);

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    plan.isActive = !plan.isActive;
    await plan.save();

    res.status(200).json({ message: "Status toggled", plan });
  } catch (err) {
    res.status(500).json({ message: "Error toggling status", error: err.message });
  }
};
