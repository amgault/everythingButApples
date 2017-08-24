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
var express = require("express");

//Import the model to use its database functions
var player = require("../models/player.js");

//create the router for our app
var router = express.Router();

// =============================================================
// ROUTES
// =============================================================

// Create all our routes and set up logic within those routes where required.


router.get("/cards", function(request, response) {
    player.refreshHand(request.id, function(data) {
        console.log(data);
        res.json(data);
    });
});

// Export routes for use by our server (server.js)
module.exports = router;