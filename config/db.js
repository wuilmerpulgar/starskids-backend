const { Pool } = require('pg');

// Aquí configuro la conexión con mi base de datos de PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stars_kids_db',
  password: 'Wuilp15.', 
  port: 5432,
});

module.exports = pool; 