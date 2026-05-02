import express from "express";
import { Component } from "../models/Component.js";
import { getComponentInsight } from "../services/componentInsightService.js";
import { getDynamicPricing } from "../services/pricingService.js";

const router = express.Router();
const validTypes = new Set(["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"]);

router.get("/", async (req, res) => {
  try {
    const { type, brand, minPrice, maxPrice, performance, search, page = 1, limit = 12, sort = "price-asc" } = req.query;
    const query = {};
    const performanceTypes = new Set(["cpu", "gpu", "ram", "storage"]);
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 12, 1), 48);

    if (type && !validTypes.has(type)) {
      return res.status(400).json({ message: "Invalid component type." });
    }

    if (minPrice && Number.isNaN(Number(minPrice))) {
      return res.status(400).json({ message: "Minimum price must be a number." });
    }

    if (maxPrice && Number.isNaN(Number(maxPrice))) {
      return res.status(400).json({ message: "Maximum price must be a number." });
    }

    if (Number.isNaN(parsedPage) || Number.isNaN(parsedLimit)) {
      return res.status(400).json({ message: "Pagination values must be numeric." });
    }

    if (type) {
      query.type = type;
    }

    if (brand) {
      query.brand = brand;
    }

    if (search?.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i"
      };
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (performance && performanceTypes.has(type)) {
      const minRankMap = {
        low: 0,
        medium: 5,
        high: 7,
        ultra: 9
      };

      query["specs.performanceRank"] = { $gte: minRankMap[performance] ?? 0 };
    }

    const sortOptions = {
      "price-asc": { price: 1, name: 1 },
      "price-desc": { price: -1, name: 1 },
      "name-asc": { name: 1 },
      "name-desc": { name: -1 },
      newest: { createdAt: -1, name: 1 }
    };

    const selectedSort = sortOptions[sort] || sortOptions["price-asc"];
    const total = await Component.countDocuments(query);
    const components = await Component.find(query)
      .sort(selectedSort)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);
    const brands = await Component.distinct("brand", type ? { type } : {});

    return res.json({
      items: components.map((component) => ({
        ...component.toObject(),
        priceInfo: getDynamicPricing(component),
        insight: getComponentInsight(component)
      })),
      brands: brands.sort(),
      total,
      page: parsedPage,
      totalPages: Math.max(Math.ceil(total / parsedLimit), 1)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch components." });
  }
});

export default router;
