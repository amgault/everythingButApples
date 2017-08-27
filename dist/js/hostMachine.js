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
    winningCards: []
};

/*============================================================================
    
    #SRM 
    HOST FUNCTIONS

============================================================================*/
function hostBuildDeck(){
    
    hostDrawGreenCards(10, 7471, 9951);
    hostDrawRedCards(80, 1, 7461);

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
        console.log(hostGlobalVar.greenDeck);
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
            alert("Player in position " + i + ": " +hostGlobalVar.playerDecks[i]);
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

/*
// #Gowri added listener to create the players array
socket.on('all players joined', function(players){
    hostInitializePlayersLocally(players)
})
*/
players=[
    {username: "USer One", playerId: 1, roomId: 1 },
    {username: "USer Two", playerId: 11, roomId: 1 },
    {username: "USer Three", playerId: 21, roomId: 1 },
    {username: "USer Four", playerId: 31, roomId: 1 },
    {username: "USer Five", playerId: 41, roomId: 1 }
]

// #SRM FIX HARCODING, the players are hardcoded right now, needs to be switched to get them via socket
// This sets the global variable of the players array.
function hostInitializePlayersLocally(players){

    hostGlobalVar.playersArray = players;

}

//Function Courtesy of Bex.
function hostStartJudging (cardsArray){
    // Bex: should run whenever all player cards are submitted
    // Bex: switch the prompt on the host screen
    // Bex: TODO: assign the data for the cards (and the players they belong to? might not be necessary if we keep info on player hands in the host side) on each card div
    hostPreparePlayedCards(cardsArray);
    
}

//Function Courtesy of Bex,updated by Sam to fit this file. Takes in an array of card objects and displays them
function hostPreparePlayedCards (cardArray){
    var index = 0;
    $(".card-back").each(function(){
        
        //Change display of of red cards to fill them with text and flip them over
        $(this).find(".nounTitleText").html(cardArray[index].title);
        $(this).find(".nounDescriptionText").html(cardArray[index].description);
        //.data("cardInfo", cardArray[index]);
        $(this).parent().toggleClass('flipped');
        
        //change the data attribute of the card so we can access it later when we pick a winner
        $(this).attr("data-player-id", cardArray[index].player_id);
        $(this).attr("data-player-username", cardArray[index].username);
        console.log(cardArray[index].player_id);

        index++;

    })
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

    // #SRM FIX HARDCODING: take in the players from socket, right now they're hardcoded.
    // #SRM Host pulls the players from socket
    hostGlobalVar.playersNum = hostInitializePlayersLocally(players);
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
    $("#judging-player").html(hostGlobalVar.playersArray[hostGlobalVar.currentLeaderIndex].username);

    //green card will display on-screen
    $("#adj-title").text(hostGlobalVar.currentGreenCard.title);
    $("#adj-description").text(hostGlobalVar.currentGreenCard.description);
    
    //#### EMIT: GREEN CARD PLAYED
    alert("GREEN CARD PLAYED: " + hostGlobalVar.currentGreenCard.title + ". ROUND" + hostGlobalVar.roundsTracker + ", TURN " + (hostGlobalVar.currentLeaderIndex+1) + " START!");

});

//#### LISTENERALL 4 "RED CARD PLAYED" MESSAGES RECEIVED ####################
//#SRM we need to replace this click event with a socket listner
$("#grabPlayedCards").on("click", function(){

    // Host will draw al the submitted cards from socket & store them locally in a submittedCards array
    //FIX HARD CODING
    hostGlobalVar.submittedCards = [
        {"id":1,"title":"A Bad Haircut","description":"The perfect start to a bad hair day.","role":"red","room_id":0,"player_id":1},
        {"id":11,"title":"A Bull Fight","description":"Also known as \"la fiesta brava\" (the brave festival).  A whole lot of bull..","role":"red","room_id":0,"player_id":11},
        {"id":21,"title":"A Car Crash","description":"\"Hey, it was an accident!\"","role":"red","room_id":0,"player_id":41},
        {"id":31,"title":"A Cheap Motel","description":"No charge for the cockroaches.","role":"red","room_id":0,"player_id":31},
        {"id":41,"title":"A Crawl Space","description":"Where you'll find something the cat dragged in.","role":"red","room_id":0,"player_id":41}
    ];

    //Submitted cards will display on the host's machine
    hostStartJudging (hostGlobalVar.submittedCards);

});

//#SRM When the host clicks on their favorite card
$(".card-back").on("dblclick", function(){

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