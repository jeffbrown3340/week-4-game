// var powerBases = [100, 100, 100, 100],
var powerBases = [15, 20, 25, 30],
    CONST_counterAttack = 25,
    enemiesDefeated = 0,
    gameState,
    images = ["blue.JPG", "red0.JPG", "pink0.JPG", "green.JPG"],
    initialHealths = [125, 150, 175, 200],
    myCtr = 0,
    myNBSP = String.fromCharCode(160),
    playerProfiles = [],
    playerOpponentN,
    playerSelfN,
    profileCount;

$("body").on("click", ".ranger-image-object", function() {
    var grabbedRanger, divId, tempElement;
    switch(gameState) {
        case "midGame":
            return;
        case "selectSelf":
        case "selectOpponent":
            $(this).css("background-color", "red");
            if (gameState === "selectSelf") {
                for (i = 0; i < profileCount; i++) {
                    grabbedRanger = $("#ranger" + i).detach();
                    // if current i is clicked item, put in battlefield, otherwise put on-deck
                    if ("ranger" + i === this.id) {
                        divId = "#battlefield";
                        playerSelfN = i;
                        playerProfiles[i].attackPower = playerProfiles[i].powerBase;
                    } else {
                        divId = "#opponent-on-deck";
                        playerProfiles[i].attackPower = 25;
                    }
                    // everybody gets moved to their next place with a right side spacer div
                    $(divId).append(grabbedRanger);
                    gameState = "selectOpponent"
                    $("#top-text").text(myNBSP);
                    $("#mid-text").text("Select your opponent...");
                }
                $("#player-on-deck").empty();
            } else if (gameState === "selectOpponent") {
                appendSpacer("#battlefield", "div-vs", "<b>VS</b>" );
                grabbedRanger = $(this).detach();
                playerOpponentN = this.id.replace("ranger", "");
                $("#battlefield").append(grabbedRanger);
                $("#mid-text").text(myNBSP);
                gameState = "midGame"
                $("#mid-text").text("Remaining opponents ...");
                $("#button-row").html("<button type='button' class='btn btn-danger btn-block' id='attack-button'>Attack</button>")
            }
            return;
    }        
});

$("body").on("click", "#attack-button", function() {
    if (gameState != "midGame") {return}
    console.log("future");
    playerProfiles[playerSelfN].healthPoints = playerProfiles[playerSelfN].healthPoints - playerProfiles[playerOpponentN].attackPower;
    if (playerProfiles[playerSelfN].healthPoints <= 0) {
        $("#ranger" + playerSelfN + "-points-text").text("0");
        $("#mid-text").html("Zero Health, Game over<br>Next time, Goldar!<br>(Refresh)");
        gameState = "GameOver";
    }
    $("#ranger" + playerSelfN + "-points-text").text(playerProfiles[playerSelfN].healthPoints);
    if (gameState === "GameOver") {return}
    playerProfiles[playerOpponentN].healthPoints = playerProfiles[playerOpponentN].healthPoints - playerProfiles[playerSelfN].attackPower;
    playerProfiles[playerSelfN].attackPower += playerProfiles[playerSelfN].powerBase;
    if (playerProfiles[playerOpponentN].healthPoints <= 0) {
        enemiesDefeated++;
        $("#ranger" + playerOpponentN).remove();
        $("#attack-button").remove();
        $(".div-vs").remove();
        if (enemiesDefeated >= (profileCount - 1)) {
            $("#mid-text").text("");
            $("#top-text").text("Winner! Go Go Power Rangers!");
        } else {
            gameState = "selectOpponent";
            $("#mid-text").text("Select next opponent...");
            return;
        }
    }
    $("#ranger" + playerOpponentN + "-points-text").text(playerProfiles[playerOpponentN].healthPoints);

});

function appendSpacer(elementString, classToAppend, html) {
    var tempElement = $("<div>");
    tempElement.addClass(classToAppend);
    tempElement.html(html);
    $(elementString).append(tempElement);
}


function spawnRanger(arrayIndex) {
    tempPProfile = { "imageSource": "", "powerBase": 0, "attackPower": 0, "healthPoints": 0, "index": -1 };
    tempPProfile.imageSource = images.splice(Math.floor(Math.random() * images.length), 1)[0];
    tempPProfile.healthPoints = initialHealths.splice(Math.floor(Math.random() * initialHealths.length), 1)[0];
    tempPProfile.powerBase = powerBases.splice(Math.floor(Math.random() * powerBases.length), 1)[0];
    tempPProfile.index = arrayIndex;
    return tempPProfile;
}

function createRangerIcon(element, profileObject) {
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
    tempElement.text(profileObject.healthPoints);
    $("#ranger" + i + "-frame").append(tempElement);
    tempElement = $("<div>");
    tempElement.addClass("ranger-spacer");
    tempElement.text(myNBSP);
    $(element).append(tempElement);
}


function initializeGame() {
    // spawn four ranger profiles into the player profile array
    for (i = 0; i < profileCount; i++) {
        playerProfiles.push(spawnRanger(i));
        createRangerIcon("#player-on-deck", playerProfiles[i]);
    }
    $(".ranger-image-object").css("background-color", "green");
    $("#top-text").text("Select a player for yourself ...");
    gameState = "selectSelf";
}

profileCount = images.length;
initializeGame();
