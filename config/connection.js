var mysql = require("mysql");

// access environmental variables for username, password, host
require('dotenv').config({ path: '../dotenv.env' });

var connection;


    var pool = mysql.createPool({
        connectionLimit: 10,
        connectTimeout: 60 * 60 * 1000,
        aquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host: "us-cdbr-iron-east-05.cleardb.net",
        port: "3306",
        user: "bc389e17ac8656",
        password: "dc0c3ab7",
        database: "heroku_6aafb0838fd5e56"
    });


module.exports = pool;