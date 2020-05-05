const { Pool } = require('pg');

const dotenv = require("dotenv")

dotenv.config();

const connectionString = process.env.DATA_BASE_URL

const pool = new Pool({
    connectionString: connectionString
});

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'verge',
//     password: 'Oluw@tosin',
//     port: 5432,
// })

pool.on("connect", () => {
    console.log("connected to db successfully");
});

pool.on("error", (err) => {
    console.log("connected to db successfully", err);
})

module.exports = pool