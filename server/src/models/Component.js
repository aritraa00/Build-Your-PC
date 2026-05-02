import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"]
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    imageUrl: {
      type: String,
      default: ""
    },
    source: {
      type: String,
      default: "seed"
    },
    externalId: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

componentSchema.index({ type: 1, brand: 1, name: 1 }, { unique: true });
componentSchema.index({ name: "text", brand: "text" });

export const Component = mongoose.model("Component", componentSchema);
