var io;
var socket;
var players = [];
var host = [];
//var $ = require("jquery");
var request = require("request");
// #GowriImport the model to use its database functions
var player = require("../../models/playerModels.js");
require('dotenv').config({ path: '../../dotenv.env' });
//var currentURL = window.location.origin;

// An object that holds the global variables for the game that the host machine needs to track
// #SRM More key/value pairs get created as needed in the initialization
//#Gowri moved global var from hostmachine to game.js
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

    // #Gowri when start button is clicked this listener will start the game by building the deck for each players
    socket.on('start game', function(senderRoom){
        hostGlobalVar.greenCardsTotal = (hostGlobalVar.playersNum*hostGlobalVar.roundsNum);
        hostGlobalVar.redCardsTotal = ( ((hostGlobalVar.playersNum*4)*hostGlobalVar.roundsNum) + ( ( (hostGlobalVar.playersNum - 1)*(hostGlobalVar.playersNum) )*hostGlobalVar.roundsNum ) );
        hostGlobalVar.deckArray = hostBuildDeck();
        // Bex: An emit to send the host the array of players for scorekeeping. the host here is kinda hard-coded, in that it is assumed the first host in the host array is the one to use
        for(var h in host){
            //if the host is the host of the room the startGame signal came from, 
            if(host[h].roomId === senderRoom){
                socket.to(host[0].playerId).emit('get player array', hostGlobalVar.playersArray);
                break;
            }
        }
        
    })
}


/*============================================================================
    
    #SRM 
    HOST FUNCTIONS
    #Moved all host functions from Host Machine to Game.js
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
        player.selectAllWithinIdList(hostGenerateIdArray( endId+1, startId ).splice( 0, cardsNum ).toString(), 
        function(data){
            //data = res.json(results);
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
            console.log(hostGlobalVar.playerDecks);
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
        //#Gowri set the players once the required number of players has joined
        hostGlobalVar.playersArray=players;
        hostGlobalVar.playersNum = hostGlobalVar.playersArray.length;

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