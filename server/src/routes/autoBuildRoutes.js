import express from "express";
import { generateAutoBuild } from "../services/autoBuildService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const budget = Number(req.body?.budget);
    const purpose = req.body?.purpose || "gaming";
    const game = req.body?.game || "fortnite";

    if (!budget || budget <= 0) {
      return res.status(400).json({ message: "Please provide a valid budget." });
    }

    const build = await generateAutoBuild({ budget, purpose, game });
    return res.json(build);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to generate auto build." });
  }
});

export default router;