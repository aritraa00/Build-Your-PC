import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { Component } from "../models/Component.js";

dotenv.config();

const validTypes = new Set(["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"]);

const normalizeItem = (item, index) => {
  if (!item || typeof item !== "object") {
    throw new Error(`Item at index ${index} is not a valid object.`);
  }

  if (!item.name || !item.type || !item.brand || typeof item.price !== "number") {
    throw new Error(`Item at index ${index} is missing required fields.`);
  }

  if (!validTypes.has(item.type)) {
    throw new Error(`Item "${item.name}" has invalid type "${item.type}".`);
  }

  return {
    name: String(item.name).trim(),
    type: item.type,
    brand: String(item.brand).trim(),
    price: item.price,
    specs: item.specs || {},
    imageUrl: item.imageUrl || "",
    source: item.source || "import",
    externalId: item.externalId || ""
  };
};

const run = async () => {
  const args = process.argv.slice(2);
  const fileArg = args.find((arg) => !arg.startsWith("--"));
  const replaceExisting = args.includes("--replace");

  if (!fileArg) {
    throw new Error("Usage: node src/scripts/importComponents.js <file.json> [--replace]");
  }

  const absolutePath = path.resolve(process.cwd(), fileArg);
  const fileContents = await fs.readFile(absolutePath, "utf8");
  const parsed = JSON.parse(fileContents);

  if (!Array.isArray(parsed)) {
    throw new Error("Import file must contain a JSON array.");
  }

  const items = parsed.map(normalizeItem);

  await connectDatabase();

  if (replaceExisting) {
    await Component.deleteMany({});
  }

  let inserted = 0;
  let updated = 0;

  for (const item of items) {
    const result = await Component.updateOne(
      { type: item.type, brand: item.brand, name: item.name },
      { $set: item },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    } else if (result.modifiedCount > 0) {
      updated += 1;
    }
  }

  console.log(`Imported ${items.length} components. Inserted: ${inserted}. Updated: ${updated}.`);
  await disconnectDatabase();
};

run().catch(async (error) => {
  console.error(error.message);
  await disconnectDatabase();
  process.exit(1);
});
