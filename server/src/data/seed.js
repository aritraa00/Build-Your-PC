import { mockComponents } from "./components.js";
import { Component } from "../models/Component.js";

export const seedComponents = async () => {
  const existing = await Component.find({}, { name: 1, type: 1 }).lean();
  const existingKeys = new Set(existing.map((item) => `${item.type}:${item.name}`));
  const missingComponents = mockComponents.filter(
    (item) => !existingKeys.has(`${item.type}:${item.name}`)
  );

  if (missingComponents.length > 0) {
    // Insert only the missing catalog records so local saved data is preserved.
    await Component.insertMany(missingComponents);
  }
};
