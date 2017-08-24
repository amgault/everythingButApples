// *********************************************************************************
// orm.js - this file creates CRUD methods to query our db
// *********************************************************************************

// =============================================================
// Dependencies
// =============================================================

// Import ORM query functions
var orm = require("../config/orm.js");


// =============================================================
// NAME OF WHATEVER THIS IS
// =============================================================

// Use ORM functions and corresponding inputs to make mySQL queries
var player = {
    
    //THIS IS FROM A PREVIOUS HOMEWORK, NOT UPDATED YET
    addNewPlayer: function(columns, values, cb){
        orm.insertOne("burgers", columns, values, function(res){
            cb(res);
        });
    },

    //this function takes in a player id 
    //and uses ORM function to query (READ) the cards table by that player_id 
    refreshHand: function(id, cb){
        orm.selectAllByKeyValue("cards_test", "player_id", id, function(res){
            cb(res);
        });
    },

    //THIS IS FROM A PREVIOUS HOMEWORK, NOT UPDATED YET
    updateOne: function(column, value, condition, cb){
        orm.updateOne("burgers", column, value, condition, function(res){
            cb(res);
        });
    }
}

/*
// code to test refreshHand. Can be used in router later.
player.refreshHand(1, function(res){
    console.log(res);
});
*/

// Export the burger database functions for use by the controller (burgers_controller.js)
module.exports = player;