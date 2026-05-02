import mongoose from "mongoose";

const buildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    parts: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    estimatedPower: {
      type: Number,
      default: 0
    },
    performanceLabel: {
      type: String,
      default: "Low"
    },
    warnings: {
      type: [String],
      default: []
    },
    shareId: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export const Build = mongoose.model("Build", buildSchema);

