import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Usar la variable de entorno DATABASE_URL o configuración directa
const connectionString = process.env.DATABASE_URL || {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cinecritica'
};

// Crear el pool de conexiones MySQL
const poolConnection = mysql.createPool(connectionString);

// Crear la instancia de Drizzle
export const db = drizzle(poolConnection, { schema, mode: 'default' });
