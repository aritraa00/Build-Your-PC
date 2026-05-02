import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth.js";
import { Build } from "../models/Build.js";
import {
  calculateTotalPrice,
  estimatePerformance,
  estimatePower,
  generateShareId,
  getCompatibilityWarnings,
  normalizeParts
} from "../utils/buildUtils.js";

const router = express.Router();
const validPartKeys = ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"];

const validateBuildPayload = (title, parts) => {
  if (!title?.trim()) {
    return "Build title is required.";
  }

  if (title.trim().length > 80) {
    return "Build title must be 80 characters or less.";
  }

  if (!parts || typeof parts !== "object" || Array.isArray(parts)) {
    return "Parts payload must be a valid object.";
  }

  const invalidKeys = Object.keys(parts).filter((key) => !validPartKeys.includes(key));

  if (invalidKeys.length > 0) {
    return "Build contains unsupported component keys.";
  }

  return null;
};

router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { title, parts } = req.body;
    const validationError = validateBuildPayload(title, parts);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Store a predictable step-keyed snapshot so shared builds stay stable over time.
    const normalizedParts = normalizeParts(parts);

    const build = await Build.create({
      user: req.user.id,
      title: title.trim(),
      parts: normalizedParts,
      totalPrice: calculateTotalPrice(normalizedParts),
      estimatedPower: estimatePower(normalizedParts),
      performanceLabel: estimatePerformance(normalizedParts),
      warnings: getCompatibilityWarnings(normalizedParts),
      shareId: generateShareId()
    });

    return res.status(201).json(build);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save build." });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, parts } = req.body;
    const validationError = validateBuildPayload(title, parts);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const normalizedParts = normalizeParts(parts);
    const build = await Build.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: title.trim(),
        parts: normalizedParts,
        totalPrice: calculateTotalPrice(normalizedParts),
        estimatedPower: estimatePower(normalizedParts),
        performanceLabel: estimatePerformance(normalizedParts),
        warnings: getCompatibilityWarnings(normalizedParts)
      },
      { new: true }
    );

    if (!build) {
      return res.status(404).json({ message: "Build not found." });
    }

    return res.json(build);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update build." });
  }
});

router.get("/user/list", authMiddleware, async (req, res) => {
  try {
    const builds = await Build.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(builds);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch saved builds." });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const build = await Build.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!build) {
      return res.status(404).json({ message: "Build not found." });
    }

    return res.json({ message: "Build deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete build." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lookup = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { shareId: req.params.id }] }
      : { shareId: req.params.id };

    const build = await Build.findOne(lookup).populate("user", "name");

    if (!build) {
      return res.status(404).json({ message: "Build not found." });
    }

    return res.json(build);
  } catch (error) {
    return res.status(404).json({ message: "Build not found." });
  }
});

export default router;
