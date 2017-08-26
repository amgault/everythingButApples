var express = require("express");
var path = require("path");
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var game =  require('./dist/js/game');

var port = process.env.PORT || 3010;



app.use(express.static(path.join(__dirname, '/dist')));

require('./routes/htmlroutes.js')(app);

io.sockets.on('connection', function (socket){
    //console.log(socket);
    game.initGame(io, socket);
})

server.listen(port);