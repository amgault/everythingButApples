// *********************************************************************************
// orm.js - this file creates CRUD methods to query our db
// *********************************************************************************

// =============================================================
// Dependencies
// =============================================================

// Import ORM query functions
var orm = require("../config/orm.js");
require('dotenv').config({ path: '../dotenv.env' });
// =============================================================
// player.js functions
// =============================================================

// Use ORM functions and corresponding inputs to make mySQL queries
var playerModels = {
    
    addNewCard: function(values, cb){
        orm.insertOne("cards_test", ["title", "description", "role", ], values, function(res){
            cb(res);
        });
    }, 

    //this function takes in a player id 
    //and uses ORM function to query (READ) the cards table by that player_id 
    selectAllByRole: function(role, cb){
        orm.selectAllByKeyValue("cards", "role", role, function(res){
            cb(res);
        });
    },

    //this function takes in a set of player ids as a comma-separated string
    //and uses ORM function to query (READ) the cards that match those ids
    //ex: values = "1, 11, 21, 31, 41" 
    selectAllWithinIdList: function(valuesString, cb){
        orm.selectAllByKeyValueList("cards", "id", valuesString, function(res){
            cb(res);
        });
    },

    selectAll: function(cb){
        orm.selectAll("cards", function(res){
            cb(res);
        });
    },

}

// Export the database functions for use by the controller (players_controller.js)
module.exports = playerModels;