// *********************************************************************************
// orm.js - this file creates CRUD methods to query our db
// *********************************************************************************

// =============================================================
// Dependencies
// =============================================================

// Import MySQL connection.
var pool = require("../config/connection.js");
// =============================================================
// ORM FUNCTIONS
// =============================================================

//orm object with methods to create the SQL queries we will need in our app
var orm = {

    // function takes in a table name, a column name, and a value to query the database
    // and return the results as a callback function
    selectAll: function(tableName, cb) {
      console.log("i called the select all function");

      pool.getConnection(function(err, connection) {
          if (err) {
              console.error("error connecting: " + err.stack);
              return;
          }
          console.log("connected as id " + connection.threadId);
          
          var queryString = "SELECT * FROM " + tableName + ";";

          connection.query(queryString, function(err, result) {
              if (err) {
                  throw err;
              }
              cb(result);
              connection.release();
          });
       });
    },

    selectAllByKeyValue: function(tableName, column, value, cb) {
      
      pool.getConnection(function(err, connection) {
        if (err) {
          console.error("error connecting: " + err.stack);
          return;
        }
        var queryString = "SELECT * FROM " + tableName + " WHERE " + column + " = '" + value + "';";
        connection.query(queryString, function(err, result) {
            if (err) {
              throw err;
            }
            cb(result);
            connection.release();
          });
      });
    },

    selectAllByKeyValueList: function(tableName, column, values, cb) {
      
      pool.getConnection(function(err, connection) {
        if (err) {
          console.error("error connecting: " + err.stack);
          return;
        }
        var queryString = "SELECT * FROM " + tableName + " WHERE " + column + " IN (" + values + ");";
        connection.query(queryString, function(err, result) {
            if (err) {
              throw err;
            }
            cb(result);
            connection.release();
          });
      });

      
        
  },

    // This function takes in a table name, an array of column names, an array of values, and a callback function
    // inserts a new row into a table and returns the results to the calback function
    insertOne: function(tableName, columns, values, cb) {
      
      pool.getConnection(function(err, connection) {
            if (err) {
              console.error("error connecting: " + err.stack);
              return;
            }

          var queryString = "INSERT INTO " + tableName + " (" + columns.toString() + ") " + "VALUES (" + values + ");";
            connection.query(queryString, function(err, result) {
                if (err) {
                  throw err;
                }
                cb(result);
                connection.release();  
              });
          
        });
              
    }, 

};

// Export the orm object for use by our models (playerModels.js)
module.exports = orm;