#################################################################
#
#   HOST
# 
#   STORY
#
#################################################################

#################################################################
#CreateTheGame
#################################################################
1.) Host presses button to create room
2.) Enters room ID (and told that a game must have 5 players, and will last 2 rounds)
3.) Assigned a socket, object with roomName, role, players (hardcode 5), and gameLength (hardcode 2)
#### LISTENER Z: "5 PLAYERS HAVE JOINED ROOM" ##################################
4.) Host will pull the array of player objects from socket to locally keep track of game stats 
5.) Host draws n random red cards from the deck and stores them in a redCards array locally
    n = ( (players*5) + ((players - 1)*((players)*rounds) )
    n = ( 25 + 4*5*2)
    n = 65
6.) Host draws y random green cards from the deck and stores them in a greenCards array lcoally
    y = players*rounds
    y = 10

7.) Host deals the game's worth of red cards to each player via an array of card objects in socket
#### EMIT A: "CARDS DEALT" ####################################################

###############################################################################
#PlayRound
###############################################################################
8.) Host will determine who the next leader is by who is up next in the player array
#### EMIT B: "YOU ARE THE LEADER" ################
9.) Send this message to 1 player

#### EMIT C: "YOU ARE NOT THE LEADER" #########################################
10.) Send this message to all other players

11.) Reveal next green card in array
#### EMIT D: "GREEN CARD REVEALED" ############################################

#### LISTENER E: ALL 4 "RED CARD PLAYED" MESSAGES RECEIVED ####################
12.) Host will draw al the submitted cards from socket
13.) Host will store them locally in a submittedCards array
14.) Submitted cards will display on the host's machine
15.) Host will pick a card to win this turn
16.) Host will check the card.player_id value for teh submitted card, and update that player's score on local storage
17.) Host adds the winning card to a winningCards array locally
18.) Host clears the submittedCArds array

19.) If it is not the last turn of a round start this section of code again from step 8
20.) If it is the last turn of the round, check if it is the last round as well
21.) If it is not also the last round, increase the local round counter
#### EMIT F: "END OF ROUND" ###############################################
22.) Go back to step 8 and repeat

23.) If it is the last turn of the last round, display winner on screen, and whatever else we want to do
#### EMIT G: "END OF GAME" ###############################################


#################################################################
#
#   PLAYER
# 
#   STORY
#
#################################################################

#################################################################
#JoinTheGame
#################################################################
1.) Click to Join a game
2.) Enter USername
3.) Get assigned a socket; player object created that has player_id, username, role, & room_id
4.) Retrieve their player object and store it locally
#################################################################

#################################################################
#InitializeTheirDeck
#################################################################
#### LISTENER A: "CARDS DEALT" ####################################################
5.) The player receives the "CARDS DEALT" message from socket.
6.) The player retrieves an array of object cards from socket, and stores it as their deck.
7.) The player loops through the deck array and assigns each sets each card.player_id to their unique player_id
8.) Take the first four cards in the array, store them in a hand array, and reveal them to the player.
#################################################################


#################################################################
#PlayRound
#################################################################
#### LISTENER B: "YOU ARE THE LEADER" 1 player receives this message############
9.) When the player receives this message from socket, they will set local var isLeader = true.

#### LISTENER C: "YOU ARE NOT THE LEADER" the rest of the players ##############
10.) When the player receives this message from socket, they will set local var isLeader = false.

#### LISTENER D: "GREEN CARD REVEALED" #########################################
11.) Else, draw the next card from their deck array and push it to their hand array.
12.) Select a card from their hand to submit
13.) Submit Card
#### EMIT E: "RED CARD PLAYED" #################################################
14.) Delete the submitted card from their hand array

15.) Go back to the beginning of the PLAY ROUND section and repeat until

#### LISTENER F: "END OF ROUND" ###############################################
16.) Delete all the cards from their hand array
17.) Draw the next 4 cards from their deck array
18.) Go back to the beginning of the PLAY ROUND SECTION UNTIL
#################################################################

#################################################################
#EndGame
#################################################################
#### LISTENER G: "END OF GAME" ###############################################
19.) Hide cards
20.) Display a message?