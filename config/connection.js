// Set up MySQL connection.
var mysql = require("mysql");

// access environmental variables for username, password, host
require('dotenv').config({path: '../dotenv.env'});

var connection;

// first try to use JAWSDB connection if it exists (for Heroku deployment)
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}

// otherwise
else {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "heroku_6aafb0838fd5e56"
});
}

// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export the connection setup for our ORM to use.
module.exports = connection;