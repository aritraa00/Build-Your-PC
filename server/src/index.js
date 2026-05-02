import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedComponents } from "./data/seed.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const app = createApp();

export const startServer = async () => {
  await connectDatabase();
  await seedComponents();

  return app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

