var cards = [
    {
        id: 1,
        title: 'Card 1',
        description: 'This is card 1'
    },
    {
        id: 2,
        title: 'Card 2',
        description: 'This is card 2'
    },
    {
        id: 3,
        title: 'Card 3',
        description: 'This is card 3'
    },
    {
        id: 4,
        title: 'Card 4',
        description: 'This is card 4'
    },
    {
        id: 5,
        title: 'Card 5',
        description: 'This is card 5'
    },
    {
        id: 6,
        title: 'Card 6',
        description: 'This is card 6'
    },
    {
        id: 7,
        title: 'Card 7',
        description: 'This is card 7'
    },
    {
        id: 8,
        title: 'Card 8',
        description: 'This is card 8'
    },
    {
        id: 9,
        title: 'Card 9',
        description: 'This is card 9'
    },
    {
        id: 10,
        title: 'Card 10',
        description: 'This is card 10'
    }
]
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
            playerId: user.playerId,
            cards: []
        })
        console.log(`added ${user.userName} to the list of hosts`);
    } else {
        players.push({
            userName: user.userName,
            roomId: user.roomId,
            role: user.role,
            playerId: user.playerId,
            cards: []
        })
        console.log(`added ${user.userName} to the list of players`);
    }
    if( players.length === 5 ) {
        players.forEach( player => {
            var myCards = cards.splice(cards.length - 2);
            io.to(player.playerId).emit('deal cards', myCards);
        })
        socket.emit('deal cards', cards);
    } else if (player.length > 0) {
        io.to(host[0].playerId).emit('players so far', players);
    }
}

// io.to(e.socketId).emit('test', `hi + ${e.userName}`));