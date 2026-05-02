const { Pool } = require('pg');

const pool = new Pool({
  // DEBE decir DATABASE_URL, que es el nombre de la variable en Render
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;