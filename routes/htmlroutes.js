var path = require('path');

module.exports = function(app){

    app.get('/host', function(req, res){
        res.sendFile(path.join(__dirname + "/../dist/views/hostTrack.html"));
    });

    app.get('/player', function(req, res){
        res.sendFile(path.join(__dirname + "/../dist/views/playerTrack.html"));
    });

    app.get('/test', function(req, res){
        res.sendFile(path.join(__dirname + "/../dist/test.html"));
    });

    app.use(function(req, res){
        res.sendFile(path.join(__dirname, "/../dist/views/landingpage.html"));
    });
};