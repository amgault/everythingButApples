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

//create the router for our app
var router = express.Router();

//Import the model to use its database functions
var player = require("../models/player.js");

var path = require("path");

// =============================================================
// ROUTES
// =============================================================

// Create all our routes and set up logic within those routes where required.
// Export routes for use by our server (server.js)
router.get("/api/cards", function(req, res) {
    player.selectAll(function(data){
        res.json(data);
    });
});

router.get('/test', function(req, res){
    res.sendFile(path.join(__dirname + "/../dist/test.html"));
});

router.use(function(req, res){
    res.sendFile(path.join(__dirname, "/../dist/views/landingpage.html"));
});



// Export routes for use by our server (server.js)
module.exports = router;