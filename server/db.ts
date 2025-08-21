import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Configuración de la base de datos usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'cinecritica',
  port: parseInt(process.env.DB_PORT || '3306')
};

// Si existe DATABASE_URL, usarla en su lugar
const connectionConfig = process.env.DATABASE_URL || dbConfig;

// Crear el pool de conexiones MySQL
const poolConnection = mysql.createPool(connectionConfig);

// Verificar la conexión
poolConnection.getConnection()
  .then(() => console.log('✅ Conexión a la base de datos establecida correctamente'))
  .catch((error) => {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1); // Terminar el proceso si no se puede conectar a la base de datos
  });

// Crear la instancia de Drizzle
export const db = drizzle(poolConnection, { schema, mode: 'default' });
