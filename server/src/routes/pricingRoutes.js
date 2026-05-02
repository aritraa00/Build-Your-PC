import express from "express";
import { getDynamicPricing } from "../services/pricingService.js";

const router = express.Router();

router.post("/quote", async (req, res) => {
  try {
    const components = Array.isArray(req.body?.components) ? req.body.components : [];

    if (components.length === 0) {
      return res.status(400).json({ message: "Provide a components array to price." });
    }

    return res.json({
      items: components.map((component) => ({
        name: component.name,
        type: component.type,
        pricing: getDynamicPricing(component)
      }))
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate mock pricing." });
  }
});

export default router;

