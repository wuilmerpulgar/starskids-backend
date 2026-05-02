const { Pool } = require('pg');

// Usamos la DATABASE_URL de Render, y si no existe (local), usamos tus datos viejos
const pool = new Pool({
  connectionString: process.env.starskids-backend.onrender.com,
  ssl: {
    rejectUnauthorized: false // Requerido por Neon para conexiones seguras
  }
});

module.exports = pool;