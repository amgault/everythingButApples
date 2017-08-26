var io;
var socket;
var players = [];
var host = [];

// #Amanda when a connection is created a new game instance is created
exports.initGame = function(sio, sock) {
    io = sio;
    socket = sock;
    socket.emit('connected', { message: "You are connected!" });

    socket.on('set user', setUser);
}

// #Amanda creates a new user and assigns them to an array based on their role.
function setUser(user) {
    console.log('setting user')
    if(user.role === 'host') {
        host.push({
            userName: user.userName,
            roomId: user.roomId,
            role: user.role,
            socket: user.socket,
            socketId: socket.id,
            cards: []
        })
        console.log(`added ${user.userName} to the list of hosts`);
    } else {
        players.push({
            userName: user.userName,
            roomId: user.roomId,
            role: user.role,
            socket: user.socket,
            socketId: socket.id,
            cards: []
        })
        console.log(`added ${user.userName} to the list of players`);
    }
}