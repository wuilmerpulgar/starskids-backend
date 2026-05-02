const { Pool } = require('pg');

const pool = new Pool({
  // DEBE decir exactamente DATABASE_URL
  // Render buscará automáticamente el link de Neon que pegaste en su panel
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;