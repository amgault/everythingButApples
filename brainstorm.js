//limit 6 players = 30 cards to begin with
//limit 3 rounds = 90 cards


//when host opens room{

    //enter in a roomkey and press button for number of rounds
    // if not a duplicate,
        //write a new row into "rooms" table with theroomkey, and number of rounds
        //roomid is auto, and the rest is null
    //else, generate new roomkey and try again


//}

//WHEN Player enters room info{

    //user enters username and clicks on room

    // query to add a new row to the players table, using player's submitted username id of room they chose
    //if successful
        //return player.id, player.username, player.score
    //if not
        //return error

    //display player.username, player.score on player's screen;
    
//}

//WHEN game starts{

    //state change to prevent users from joining game in-progress
    //query on host machine to pull all players in the room and display stats on-screen
    //put players in array, shuffle arrayto randomize turn order

    //host stores an array of card objects each for the NOUNS and the ADJECTIVES
    //shuffles both arrays, assigns 7 NOUN cards to each player.
        //host makes the changes on their local storage and updates the cards on the db
    
    //each device makes a query to get their cards by their userid
    //store cards on local storage for each player

    //display cards on player's screen

----

//ROUND STARTS

    //start round 1 of N
    // first round leader is local [0] in player's array

    //front-end limits lead player
    
    //Time Limit starts

    //show adjective
        //pick [0] in the host's local ADJECTIVES array
        //display on host's screen

    //Player picks card
        //once they hit the button, we query the db to update the "played this round" attribute of that specific card (by id)
    
    //TIME UP
        //host machine query db to get all cards where "played this round" is true
        //these noun cards are displayed onscreen
        //host machine picks one of the displayed cards.
        //host machine queries db to update that player's score attribute +1
        //host machine queries db to set all the "played this round" back to FALSE and those played cards playerid to 99999
        //host machine uses shuffled local array of nouns to pick the next [playerCount] cars to deal to each non-Leader player
        
        //make next person the leader on their local storage, then update the database to reflect
        //each player queries db to get their new card -- refresh the whole hand isntead of trying to only get the new ones

//}

    //TURN STARTS (again)
    // leader is local[++] in host's array

    //..REPEAT turnsuntil reach end of players array on host machine

    //if players[x] is players.length-1
        //repeat turn as normal
        //at end of turn, check for end-of-game;
        
//end of last turn of last round
    //display winner - query database of players for this room, display all scores
    //local machine can highlight the winner