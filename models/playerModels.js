// *********************************************************************************
// orm.js - this file creates CRUD methods to query our db
// *********************************************************************************

// =============================================================
// Dependencies
// =============================================================

// Import ORM query functions
var orm = require("../config/orm.js");

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

/*
// code to test drawCard. Can be used in router later.
player.drawCard(1, function(res){
    console.log(res);
});
*/

/*
// code to test refreshHand. Can be used in router later.
player.refreshPlayerStats(1, function(res){
    console.log(res);
});
*/

/*
// code to test addNewPlayer. Can be used in router later.
player.addNewPlayer(["'playerZ'", 1], function(res){
    console.log(res);
});
*/

/*
// code to test addNewGame. Can be used in router later.
player.addNewRoom(["'TESTING ROOM 2'", 1], function(res){
    console.log(res);
});
*/

/*
// code to test increaseScore. Can be used in router later.
player.increaseScore(1, "id = 31", function(res){
    console.log(res);
});
*/

/*
// code to test playCard. Can be used in router later.
player.playCard("id = 91", function(res){
    console.log(res);
});
*/


// Export the burger database functions for use by the controller (burgers_controller.js)
module.exports = playerModels;