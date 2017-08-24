// *********************************************************************************
// orm.js - this file creates CRUD methods to query our db
// *********************************************************************************

// =============================================================
// Dependencies
// =============================================================

// Import MySQL connection.
var connection = require("../config/connection.js");

// =============================================================
// NAMEOF WHATEVER THIS IS
// =============================================================

//orm object with methods to create the SQL queries we will need in our app
var orm = {

    // function takes in a table name, a column name, and a value to query the database
    // and return the results as a callback function
    selectAllByKeyValue: function(tableName, column, value, cb) {
        var queryString = "SELECT * FROM " + tableName + " WHERE " + column + " = '" + value + "';";
        connection.query(queryString, function(err, result) {
            if (err) {
              throw err;
            }
            cb(result);
          });
    },

    // This function takes in a table name, an array of column names, an array of values, and a callback function
    // inserts a new row into a table and returns the results to the calback function
    insertOne: function(tableName, columns, values, cb) {
        var queryString = "INSERT INTO " + tableName + " (" + columns.toString() + ") " + "VALUES (" + values + ");";
        connection.query(queryString, function(err, result) {
            if (err) {
              throw err;
            }
            cb(result);
          });
    }, 

    //THIS IS FROM A PREVIOUS HOMEWORKNOT UPDATED YET
    updateOne: function(tableName, column, value, condition, cb) {
        //UPDATE burgers SET devoured = 1 WHERE id = 3;
        var queryString = "UPDATE " + tableName + " SET " + column + " = " + value + " WHERE " + condition + ";";
        connection.query(queryString, function(err, result) {
            if (err) {
              throw err;
            }
            cb(result);
        });
    }

};


// Export the orm object for use by our models (burger.js)
module.exports = orm;