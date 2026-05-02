import express from "express";
import { getPerformanceBreakdown, getPerformanceLabel } from "../services/performanceService.js";

const router = express.Router();

router.post("/estimate", async (req, res) => {
  try {
    const parts = req.body?.parts || {};
    const performance = getPerformanceBreakdown(parts);

    return res.json({
      ...performance,
      label: getPerformanceLabel(performance.combinedScore)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to estimate performance." });
  }
});

export default router;

