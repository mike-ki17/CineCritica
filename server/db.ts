import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
dotenv.config();
// Configuración de la base de datos usando variables de entorno

const dbConfig = {
  host: process.env.VITE_DB_HOST || 'localhost',
  user: process.env.VITE_DB_USER || 'root',
  password: process.env.VITE_DB_PASSWORD || 'root',
  database: process.env.VITE_DB_NAME || 'cinecritica',
  port: parseInt(process.env.VITE_DB_PORT || '3306')
};

console.log('🔄 Intentando conectar a la base de datos con la configuración:', {
  ...dbConfig,
  password: '****' // Ocultar la contraseña en los logs
});

// Crear el pool de conexiones MySQL
const poolConnection = mysql.createPool(dbConfig);

// Verificar la conexión inmediatamente
async function testConnection() {
  try {
    const connection = await poolConnection.getConnection();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1); // Terminar el proceso si no se puede conectar
  }
}

// Ejecutar la prueba de conexión
testConnection();

// Crear la instancia de Drizzle
export const db = drizzle(poolConnection, { schema, mode: 'default' });
