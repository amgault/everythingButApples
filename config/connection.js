var mysql = require("mysql");

// access environmental variables for username, password, host
require('dotenv').config({ path: '../dotenv.env' });

var connection;

// first try to use JAWSDB connection if it exists (for Heroku deployment)
if (process.env.CLEARDB_DATABASE_URL) {
    connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
}

// otherwise
else {
    //console.log("host: " + process.env.DB_HOST);
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "heroku_6aafb0838fd5e56"
    });
    var pool = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "heroku_6aafb0838fd5e56"
    });
}

module.exports = pool;
