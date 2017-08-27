/*============================================================================
  
    #SRM 
    host functions

============================================================================*/




//1.) Host presses button to create room
//2.) Enters room ID (and told that a game must have 5 players, and will last 2 rounds)
//3.) Assigned a socket, object with roomName, role, players (hardcode 5), and gameLength (hardcode 2)

/*============================================================================
    
    #SRM
    HOST GLOBAL VARIABLES

=============================================================++==============*/
var currentURL = window.location.origin;

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
             $.ajax({
                url: currentURL + "/api/cards/draw",
                method: "POST",
                // #SRM Create a shuffled array of all red card ids in our db, then splice it to match our game length, and turn it into a string
                data: {
                    idsString: ( hostGenerateIdArray( endId+1, startId ).splice( 0, cardsNum ).toString() )
                } 
            }).done(function(data){
                hostGlobalVar.greenDeck = data;
    
                // Prepare the first green card to be revealed
                hostGlobalVar.currentGreenCard = hostGlobalVar.greenDeck[hostGlobalVar.currentGreenCardIndex];
            });
        
        }
    
    function hostDrawRedCards(cardsNum, startId, endId){
    
         // #SRM AJAX call to grab an array of all the red cards that all players will need for the game
         $.ajax({
            url: currentURL + "/api/cards/draw",
            method: "POST",
            // #SRM Create a shuffled array of all red card ids in our db, then splice it to match our game length, and turn it into a string
            // NOTE: the card ids have been set to match our database as it appeared on 2017.08.26 
            data: {
                idsString: ( hostGenerateIdArray( endId+1, startId ).splice( 0, cardsNum ).toString() )
            } 
        }).done(function(data){
    
            // Divide the cards into personal decks for each player, supplying enough red cards for the whole game
            for(i=0; i<hostGlobalVar.playersArray.length; i++){
                var cardsPerPlayer = ( (hostGlobalVar.playersArray.length-1)+4 )*hostGlobalVar.roundsNum;
                var personalDeck = [];
                
                for (j=0; j<cardsPerPlayer; j++){
                    personalDeck.push(data[hostGlobalVar.dealerTracker]);
                    hostGlobalVar.dealerTracker++;
                }
    
                hostGlobalVar.playerDecks.push(personalDeck);
                io.to(playersArray[i].playerId).emit('deal cards', myCards);
                //alert("Player in position " + i + ": " +hostGlobalVar.playerDecks[i]);
            }
        });
    
    }
    
    // #SRM This function takes in no argument. It is called on to emit leader/!leader messages to players via sockect,
    // The leader for the next round is determined at the end of the previous round
    function hostEmitRoundLeader(){
    
        for (i=0; i<hostGlobalVar.playersArray.length; i++){
            if (i === hostGlobalVar.currentLeaderIndex){
    
                //#SRM This needs to be replaced with a socket EMIT
                alert("PLAYER IN POSITION" + i + ", you ARE the leader");
            }
            else{ 
                //#SRM This needs to be replaced with a socket EMIT
                alert("PLAYER  IN POSITION" +i + ", you ARE NOT the leader");
            }
        }
    
    }

    // #Gowri added listener to create the players array adding the varible to the start game button as data

    socket.on('all players joined', function(players){
        var hostGlobalVar = hostInitializePlayersLocally(players);
        
    });
    /*{
        console.log('i am in host machine');
        console.log('host machine', players);
        hostGlobalVar.playersArray = players.slice(0);
        console.log("received array"+players);
        console.log("host array"+hostGlobalVar.playersArray);
        console.log("host array length"+hostGlobalVar.playersArray.length);
        hostGlobalVar.playersNum = hostGlobalVar.playersArray.length;
        console.log("playnum"+hostGlobalVar.playersNum);
        
    })*/
    
    // #SRM FIX HARCODING, the players are hardcoded right now, needs to be switched to get them via socket
    // This sets the global variable of the players array.
    function hostInitializePlayersLocally(players){

        hostGlobalVar.playersArray = players;
        hostGlobalVar.playersNum = hostGlobalVar.playersArray.length;
        
        //#SRM WE NEED TO REPLACE THIS WITH A SOCKET CALL
       /* hostGlobalVar.playersArray = [
            {
                username: "Player1",
                roomId: 1,
                role: "player",
                playerId: 1,
                score: 0
            },
            {
                username: "Player2",
                roomId: 1,
                role: "player",
                playerId: 11,
                score: 0
            },
            {
                username: "Player3",
                roomId: 1,
                role: "player",
                playerId: 21,
                score: 0
            },
            {
                username: "Player4",
                roomId: 1,
                role: "player",
                playerId: 31,
                score: 0
            },
            {
                username: "Player5",
                roomId: 1,
                role: "player",
                playerId: 41,
                score: 0
            }
        ];*/

    
        
    
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

/*============================================================================
    
    #SRM 
    HOST GAME LOGIC

============================================================================*/


// #SRM This is hardcoded as a button press. We need to change it to a socket listener event: 
// "5 PLAYERS HAVE JOINED ROOM"
$("#start-game-button").on("click", function(){
    //e.preventDefault();
    var hostGlobalVar = $("#start-game-button").data("hostVar");
    // #SRM FIX HARDCODING: take in the players from socket, right now they're hardcoded.
    // #SRM Host pulls the players from socket
    /* #Gowri removed the call to hostInitializePlayersLocally since that is called by socket once room is full 
    so changing to directly measure the length*/
    console.log("inside start"+hostGlobalVar.playersNum);
    console.log("inside start"+hostGlobalVar.playersArray);
    console.log("inside start"+hostGlobalVar.playersArray);
    showAndHide("host-pregame-lobby", "host-game");
    
   hostGlobalVar.greenCardsTotal = (hostGlobalVar.playersNum*hostGlobalVar.roundsNum);
   hostGlobalVar.redCardsTotal = ( ((hostGlobalVar.playersNum*4)*hostGlobalVar.roundsNum) + ( ( (hostGlobalVar.playersNum - 1)*(hostGlobalVar.playersNum) )*hostGlobalVar.roundsNum ) );

    //Uses a series of functions to make an AJAX call to store the green cards for the whole game
    //and distribute individual red card decks to each player
   hostGlobalVar.deckArray = hostBuildDeck();   
});

//#SRM for FRONTEND:This needs to be an actual button
$("#showGreenCard").on("click", function(){

    //#SRM PLACEHOLDER FOR FRONTEND:
    //DISPLAY CURRENT LEADER
    console.log("CURRENT LEADER: " + hostGlobalVar.playersArray[hostGlobalVar.currentLeaderIndex].username);

    //green card will display on-screen
    //#SRM PLACEHOLDER FOR FRONTEND

    //#### EMIT: GREEN CARD PLAYED
    alert("GREEN CARD PLAYED: " + hostGlobalVar.currentGreenCard.title + ". ROUND" + hostGlobalVar.roundsTracker + ", TURN " + (hostGlobalVar.currentLeaderIndex+1) + " START!");

});

//#### LISTENERALL 4 "RED CARD PLAYED" MESSAGES RECEIVED ####################
//#SRM we need to replace this click event with a socket listner
$("#grabPlayedCards").on("click", function(){

    

    // Host will draw al the submitted cards from socket & store them locally in a submittedCards array
    //FIX HARD CODING
    hostGlobalVar.submittedCards = [
        {"id":1,"title":"A Bad Haircut","description":"The perfect start to a bad hair day.","role":"red","room_id":0,"player_id":0},
        {"id":11,"title":"A Bull Fight","description":"Also known as \"la fiesta brava\" (the brave festival).  A whole lot of bull..","role":"red","room_id":0,"player_id":0},
        {"id":21,"title":"A Car Crash","description":"\"Hey, it was an accident!\"","role":"red","room_id":0,"player_id":0},
        {"id":31,"title":"A Cheap Motel","description":"No charge for the cockroaches.","role":"red","room_id":0,"player_id":0},
        {"id":41,"title":"A Crawl Space","description":"Where you'll find something the cat dragged in.","role":"red","room_id":0,"player_id":0}
    ];

    //Submitted cards will display on the host's machine
    //#SRM PLACEHOLDER FOR FRONTEND


});

//#SRM When the host clicks on their favorite card
$("#pickWinner").on("click", function(){

    //Host adds the winning card to a winningCards array locally
    hostGlobalVar.winningCards.push();

    //Host clears the submittedCArds array
    hostGlobalVar.submittedCards = [];

    //Check if it is the last turn of the last round
    if (hostGlobalVar.currentLeaderIndex+1 === hostGlobalVar.playersArray.length && hostGlobalVar.roundsTracker === hostGlobalVar.roundsNum){
        
            //#SRM for FRONT END:
            // Hide all buttons, etc. so people can't try to keep playing
            // Display the winner?

            //#SRM EMIT AN END OF GAME MESSAGE TO ALL THE PLAYERS
            alert("END OF GAME");

    }
    else if (hostGlobalVar.currentLeaderIndex+1 === hostGlobalVar.playersArray.length){
    //if it is not the last round, get ready for the next round 

        //increase the round tracker
        hostGlobalVar.roundsTracker++;

        //reset the leader rotation for the next round
        hostGlobalVar.currentLeaderIndex = 0;

        //# EMIT "END OF ROUND" to all players via socket
        hostEmitRoundLeader();
        alert("END OF ROUND");
    }


    // if it's not the last turn of a round, then get ready for the next turn
    else{
        //#SRM for frontend: display a temp message on the host screen that it's the next person's turn?

        // Queue up the next green card for the next time someone presses the reveal button
        hostGlobalVar.currentGreenCardIndex++;
        hostGlobalVar.currentGreenCard = hostGlobalVar.greenDeck[hostGlobalVar.currentGreenCardIndex];

        // Queue up the next leader for the next time and emit the round leader messages to prep for next turn
        hostGlobalVar.currentLeaderIndex++;
        hostEmitRoundLeader();

    }
    
});