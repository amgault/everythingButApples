// *********************************************************************************
/*  
    players_controller.js
    this file uses express to create routes
    this file uses functions exported by players.js to apply logic to those routes to make queries
    designed for individual player machines to call in our game
*/
 // *********************************************************************************

// =============================================================
// Dependencies
// =============================================================

//Import the model to use its database functions
var player = require("../models/player.js");
var express = require("express");
var router = express.Router();

// =============================================================
// ROUTES
// =============================================================

// Create all our routes and set up logic within those routes where required.

//player.selectAll(function(data){
//    console.log(data)});

// Export routes for use by our server (server.js)

router.get("/api/cards", function(req, res) {
    player.selectAll(function(data) {
        console.log(data);
        return res.json(data);
    });
});

module.exports = router;