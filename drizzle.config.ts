import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not found, using default configuration");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql2",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
