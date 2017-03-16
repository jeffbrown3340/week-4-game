// all players initialized with random power base and
// random initial health, random color
// playerProfiles = array of playerObjects
// playerSelf/OpponentN assigns element number to profile
var powerBases = [20, 25, 30, 35],
    CONST_counterAttack = 25,
    enemiesDefeated = 0,
    gameState,
    images = ["blue.JPG", "red0.JPG", "pink0.JPG", "green.JPG"],
    initialHealths = [150, 200, 250, 300],
    myCtr = 0,
    myNBSP = String.fromCharCode(160),
    playerProfiles = [],
    playerOpponentN,
    playerSelfN = -1,
    profileCount;

$("body").on("click", ".ranger-image-object", function() {
    var grabbedRanger, divId, tempElement;
    // ignore re-clicking the self player (only respond to clicks on opponent pool)
    // playerSelfN initialized to -1, then permanently set to first clicked player
    if (this.id === "ranger" + playerSelfN) {return}
    // actions based on gameState
    switch(gameState) {
        // ignore clicks on players if game in progress (attack only during game)
        case "midGame":
            return;
        case "selectSelf":
        case "selectOpponent":
            // change frame to red on selection
            $(this).css("background-color", "red");
            if (gameState === "selectSelf") {
                // "grab" profiles corresponding to the clicked object
                for (i = 0; i < profileCount; i++) {
                    grabbedRanger = $("#ranger" + i).detach();
                    // if current i is clicked item, put in battlefield (ie select self), otherwise put on-deck (ie expose opponents)
                    if ("ranger" + i === this.id) {
                        // divID is a string, will determine where the player is placed
                        // self selected and headed for battlefield area
                        divId = "#battlefield";
                        // identify the player (self) as clicked object (ie this)
                        playerSelfN = i;
                        // initial attack power for self/player is power base
                        playerProfiles[i].attackPower = playerProfiles[i].powerBase;
                    } else {
                        // not selected so headed for on-deck waiting area
                        divId = "#opponent-on-deck";
                        // opponents have static attack power per specs
                        playerProfiles[i].attackPower = 25;
                    }
                    // everybody gets moved to their next place with a right side spacer div for appearance
                    $(divId).append(grabbedRanger);
                    // change display for next step
                }
                $("#top-text").html("Power Up!");
                $("#mid-text").text("Select your opponent...");
                $("#player-on-deck").empty();
                gameState = "selectOpponent"
            } else if (gameState === "selectOpponent") {
                // now the click means user has selected an opponent
                // put the opponent in the battlefield with versus display
                appendSpacer("#battlefield", "div-vs", "<b>VS</b>" );
                // "grab" the corresponding profile (ie remove from array and hold it in variable)
                grabbedRanger = $(this).detach();
                // identify the opponent as the clicked object
                playerOpponentN = this.id.replace("ranger", "");
                // move the selected opponent to the battlefield
                $("#battlefield").append(grabbedRanger);
                // clear instructive display
                $("#mid-text").text(myNBSP);
                // when no enemies remain, we don't need to display label
                // remaining enemies is always profile count minus 1) player 2) opponent and 3) the opponent we just clicked
                if (enemiesDefeated >= (profileCount - 3)) {
                    $("#mid-text").text("");
                } else {
                    $("#mid-text").text("Remaining opponents ...");
                }
                // show the attack button
                $("#button-row").html("<button type='button' class='btn btn-danger btn-block' id='attack-button'>Attack</button>")
                $("#top-text").text("It's Morphin' Time!");
                gameState = "midGame"
            }
            return;
    }        
});

$("body").on("click", "#attack-button", function() {
    // ignore attack click if not during game, ie self and opponent selected
    if (gameState != "midGame") {return}
    // opponent counter attacks player
    playerProfiles[playerSelfN].healthPoints = playerProfiles[playerSelfN].healthPoints - playerProfiles[playerOpponentN].attackPower;
    // if player is dead
    if (playerProfiles[playerSelfN].healthPoints <= 0) {
        $("#ranger" + playerSelfN + "-points-text").html("<b>0</b>");
        $("#top-text").text("Next time, Goldar!");
        $("#mid-text").html("Zero Health, Game over<br>(Refresh)");
        gameState = "GameOver";
    }
    // update display
    $("#ranger" + playerSelfN + "-points-text").html("<b>" + playerProfiles[playerSelfN].healthPoints + "</b>");
    if (gameState === "GameOver") {return}
    // attack opponent
    playerProfiles[playerOpponentN].healthPoints = playerProfiles[playerOpponentN].healthPoints - playerProfiles[playerSelfN].attackPower;
    // increase player attack power
    playerProfiles[playerSelfN].attackPower += playerProfiles[playerSelfN].powerBase;
    // if opponent is defeated
    if (playerProfiles[playerOpponentN].healthPoints <= 0) {
        // count enemies defeated to determine end of game
        enemiesDefeated++;
        // hide or show some stuff based on progress
        $("#attack-button").remove();
        $("#ranger" + playerOpponentN).remove();
        $("#attack-button").remove();
        $(".div-vs").remove();
        if (enemiesDefeated >= (profileCount - 1)) {
            $("#mid-text").html("Winner!<br>(Refresh)");
            $("#top-text").html("Go Go<br>Power Rangers!");
        } else {
            gameState = "selectOpponent";
            $("#mid-text").text("Select next opponent...");
            return;
        }
    }
    // update display
    $("#ranger" + playerOpponentN + "-points-text").html("<b>" + playerProfiles[playerOpponentN].healthPoints + "</b>");

});

function appendSpacer(elementString, classToAppend, html) {
    // puts a little space between image objects/elements for appearance
    var tempElement = $("<div>");
    tempElement.addClass(classToAppend);
    tempElement.html(html);
    $(elementString).append(tempElement);
}


function spawnRanger(arrayIndex) {
    // create an object to contain player data only
    tempPProfile = { "imageSource": "", "powerBase": 0, "attackPower": 0, "healthPoints": 0, "index": -1 };
    // randomly pull out (splice) one each image, initial health and power base
    tempPProfile.imageSource = images.splice(Math.floor(Math.random() * images.length), 1)[0];
    tempPProfile.healthPoints = initialHealths.splice(Math.floor(Math.random() * initialHealths.length), 1)[0];
    tempPProfile.powerBase = powerBases.splice(Math.floor(Math.random() * powerBases.length), 1)[0];
    tempPProfile.index = arrayIndex;
    return tempPProfile;
}

function createRangerIcon(element, profileObject) {
    // create a div parent for children: color changing frame, image and Health
    // this is the onscreen representation of the playerProfile
    // will be moved around DOM with jquery in click events
    var tempElement = $("<div>");
    tempElement.addClass("ranger-image-object");
    tempElement.attr("id", "ranger" + i);
    $(element).append(tempElement);
    tempElement = $("<div>");
    tempElement.addClass("ranger-image-frame")
    tempElement.attr("id", "ranger" + i + "-frame");
    $("#ranger" + i).append(tempElement);
    tempElement = $("<img>");
    tempElement.addClass("ranger-image");
    tempElement.attr("src", "assets/images/" + profileObject.imageSource);
    tempElement.attr("data-healthpoints", profileObject.healthPoints);
    $("#ranger" + i + "-frame").append(tempElement)
    tempElement = $("<div>");
    tempElement.addClass("ranger-image-points");
    tempElement.attr("id", "ranger" + i + "-points-text");
    tempElement.html("<b>" + profileObject.healthPoints + "</b>");
    $("#ranger" + i + "-frame").append(tempElement);
    tempElement = $("<div>");
    tempElement.addClass("ranger-spacer");
    tempElement.text(myNBSP);
    $(element).append(tempElement);
}


function initializeGame() {
    // spawn four ranger profiles into the player profile array
    for (i = 0; i < profileCount; i++) {
        // playerProfiles = array of playerObjects
        playerProfiles.push(spawnRanger(i));
        // create a div for color changing frame, image and Health
        createRangerIcon("#player-on-deck", playerProfiles[i]);
    }
    $(".ranger-image-object").css("background-color", "green");
    $("#top-text").text("Select a player for yourself ...");
    gameState = "selectSelf";
}

profileCount = images.length;
initializeGame();
