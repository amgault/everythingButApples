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
//var $ = require("jquery");
var request = require("request");

//var currentURL = window.location.origin;

// An object that holds the global variables for the game that the host machine needs to track
// #SRM More key/value pairs get created as needed in the initialization
var hostGlobalVar = {
    currentGreenCard: null,
    currentGreenCardIndex: 0,
    currentLeaderIndex: 0,
    dealerTracker: 0,
    greenDeck: [],
    playersArray: [],
    playerDecks: [],
    roundsNum: 2,
    roundsTracker: 1,
    submittedCards: [],
    winningCards: [],
    playersNum: 0
};

// #Amanda when a connection is created a new game instance is created
exports.initGame = function(sio, sock) {
    io = sio;
    socket = sock;
    socket.emit('connected', { message: "You are connected!" });

    socket.on('set user', setUser);
    socket.on('start game', function(){
        hostGlobalVar.greenCardsTotal = (hostGlobalVar.playersNum*hostGlobalVar.roundsNum);
        hostGlobalVar.redCardsTotal = ( ((hostGlobalVar.playersNum*4)*hostGlobalVar.roundsNum) + ( ( (hostGlobalVar.playersNum - 1)*(hostGlobalVar.playersNum) )*hostGlobalVar.roundsNum ) );
        hostGlobalVar.deckArray = hostBuildDeck();
        console.log(hostGlobalVar) ;
    })
}


/*============================================================================
    
    #SRM 
    HOST FUNCTIONS

============================================================================*/
function hostBuildDeck(){
    
        hostDrawGreenCards(hostGlobalVar.greenCardsTotal, 7471, 9951);
        hostDrawRedCards(hostGlobalVar.redCardsTotal, 1, 7461);
    
    }
    
    //function makes an AJAX call and sets global variable so our host Machine can access this array later;
    function hostDrawGreenCards(cardsNum, startId, endId){
        
             // #SRM AJAX call to grab an array of all the red cards that all players will need for the game
             request.post(
                "/api/cards/draw",
                // #SRM Create a shuffled array of all red card ids in our db, then splice it to match our game length, and turn it into a string
                {
                    idsString: ( hostGenerateIdArray( endId+1, startId ).splice( 0, cardsNum ).toString() )
                } ,
            function(data){
                console.log("i am in host draw green")
                hostGlobalVar.greenDeck = data;
    
                // Prepare the first green card to be revealed
                hostGlobalVar.currentGreenCard = hostGlobalVar.greenDeck[hostGlobalVar.currentGreenCardIndex];
            });
        
        }
    
    function hostDrawRedCards(cardsNum, startId, endId){
    
         // #SRM AJAX call to grab an array of all the red cards that all players will need for the game
         request.post(
            "/api/cards/draw",
            
            // #SRM Create a shuffled array of all red card ids in our db, then splice it to match our game length, and turn it into a string
            // NOTE: the card ids have been set to match our database as it appeared on 2017.08.26 
            {
                idsString: ( hostGenerateIdArray( endId+1, startId ).splice( 0, cardsNum ).toString() )
            } , 
        function(data){
    
            // Divide the cards into personal decks for each player, supplying enough red cards for the whole game
            for(i=0; i<hostGlobalVar.playersArray.length; i++){
                var cardsPerPlayer = ( (hostGlobalVar.playersArray.length-1)+4 )*hostGlobalVar.roundsNum;
                var personalDeck = [];
                
                for (j=0; j<cardsPerPlayer; j++){
                    personalDeck.push(data[hostGlobalVar.dealerTracker]);
                    hostGlobalVar.dealerTracker++;
                }
    
                hostGlobalVar.playerDecks.push(personalDeck);
                io.to(hostGlobalVar.playersArray[i].playerId).emit('deal cards', hostGlobalVar.playerDecks[i]);
                //alert("Player in position " + i + ": " +hostGlobalVar.playerDecks[i]);
            }
        });
    
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
            score: 0,
            cards: []
        })
        console.log(`added ${user.userName} to the list of players`);
    }
    if( players.length === 3 ) {
        //#Gowri send the players to Host Machine
        hostGlobalVar.playersArray=players;
        hostGlobalVar.playersNum = hostGlobalVar.playersArray.length;

        //socket.emit('all players joined', players);
       /* players.forEach( player => {
            var myCards = cards.splice(cards.length - 2);
            io.to(player.playerId).emit('deal cards', myCards);
        })
        socket.emit('deal cards', cards);*/
    } 
    // #Gowri emit the players to Host screen
    if (players.length > 0 && players.length < 6) {
         io.to(host[0].playerId).emit('player joined', players);
    }
}


//Bex: Generating array of ids
    function hostSerialArray(n, initialId){
        var arr = [];
        for (var i = initialId; i <= n-1; i+=10) {
            arr.push(i);
        }
        return arr;
    }
    
    // Function supplied directly by Bex
    function hostShuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }
    
    // #SRM this assumes a databse identical to the 2017.08.26 version, if cards/ids change, the query incorporating these ids risks breaking
    // #SRM This function generates a shuffled array of ids corresponding to cards in our db
    function hostGenerateIdArray(endNum, startNum){
        return hostShuffle(hostSerialArray(endNum, startNum));
    }


// io.to(e.socketId).emit('test', `hi + ${e.userName}`));