const Pool = require("pg").Pool;
require("dotenv").config();

const env = process.env.NODE_ENV;
let pool;

if (env === "development") {
  pool = new Pool({
    user: "postgres",
    password: "new_password",
    host: "localhost",
    port: 5432,
    database: "flashcards",
  });
} else {
  pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
  });
}

// const pool = new Pool({
//     user: "postgres",
//     password: "new_password",
//     host: "localhost",
//     port: 5432,
//     database: "flashcards"
// })

module.exports = pool;
