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
var player = {
    
    //This function takes in a values array to insert a new row into the Players table.
    //NOTE: the username in the values array must be a string with inner single quotes
    // Ex: values = ["'PlayerZ'", 1]
    addNewPlayer: function(values, cb){
        orm.insertOne("players", ["username", "room_id"], values, function(res){
            cb(res);
        });
    },

    //This function takes in a values array to insert a new row into the games table.
    //NOTE: the room name in the values array must be a string with inner single quotes
    // Ex: values = ["'Test Room'", 3]
    addNewRoom: function(values, cb){
        orm.insertOne("rooms", ["roomName", "gameLength"], values, function(res){
                cb(res);
        });
    },

    //This function takes in a single value for the new score and a string that will serve as the condition
    //in an SQL query
    // Ex: values = 1 ; condition = "id = 31"
    increaseScore: function(value, condition, cb){
        orm.updateOne("players", "score", value, condition, function(res){
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

    //this function takes in a player id 
    //and uses ORM function to query (READ) the cards table by that player_id 
    refreshPlayerStats: function(id, cb){
        orm.selectAllByKeyValue("players", "id", id, function(res){
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

// Export the burger database functions for use by the controller (burgers_controller.js)
module.exports = player;