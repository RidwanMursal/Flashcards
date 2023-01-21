const Pool = require("pg").Pool;
require("dotenv").config();

// const pool = new Pool({
//     user: "postgres",
//     password: "new_password",
//     host: "localhost",
//     port: 5432,
//     database: "flashcards"
// })

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

module.exports = pool;
