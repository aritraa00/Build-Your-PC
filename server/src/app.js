import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import autoBuildRoutes from "./routes/autoBuildRoutes.js";
import buildRoutes from "./routes/buildRoutes.js";
import componentRoutes from "./routes/componentRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "https://build-your-pc-blond.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        const isAllowed = allowedOrigins.includes(origin);
        return callback(isAllowed ? null : new Error("Origin not allowed by CORS"), isAllowed);
      }
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRoutes);
  app.use("/components", componentRoutes);
  app.use("/build", buildRoutes);
  app.use("/pricing", pricingRoutes);
  app.use("/performance", performanceRoutes);
  app.use("/auto-build", autoBuildRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} was not found.` });
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({ message: "Invalid JSON payload." });
    }

    return res.status(500).json({ message: "Something went wrong on the server." });
  });

  return app;
};
