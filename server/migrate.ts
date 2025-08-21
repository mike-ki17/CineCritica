import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

// Esta función ejecutará todas las migraciones
async function runMigrations() {
  console.log("Running migrations...");
  
  await migrate(db, { migrationsFolder: "./drizzle" });
  
  console.log("Migrations completed!");
}

runMigrations().catch(console.error);
