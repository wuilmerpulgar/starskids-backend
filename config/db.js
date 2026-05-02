const { Pool } = require('pg');

const pool = new Pool({
  // Usa la variable que configuramos en el panel de Render
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Esto es lo que permite que Neon acepte la conexión
  }
});

module.exports = pool;