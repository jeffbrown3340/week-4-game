var powerBases = [4, 6, 8, 10],
    CONST_counterAttack = 25,
    gameState,
    images = ["blue.JPG", "red.JPG", "pink.JPG", "green.JPG"],
    initialHealths = [125, 150, 175, 200],
    myCtr = 0,
    myNBSP = String.fromCharCode(160),
    playerProfiles = [],
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
                    // initialize divId to battlefield but change to on-deck if not selected ranger
                    divId = "#battlefield";
                    if ("ranger" + i != this.id) { divId = "#opponent-on-deck" }
                    // everybody gets moved to their next place with a right side spacer div
                    $(divId).append(grabbedRanger);
                    appendSpacer(divId, "ranger-spacer");
                    gameState = "selectOpponent"
                    $("#top-text").text(myNBSP);
                    $("#mid-text").text("Select your  opponent...");
                }
                $("#player-on-deck").empty();
            } else {
                appendSpacer("#battlefield", "ranger-spacer");
                grabbedRanger = $(this).detach();
                $("#battlefield").append(grabbedRanger);
                $("#mid-text").text(myNBSP);
            }
            return;
    }        
});

function appendSpacer(elementString, classToAppend) {
    var tempElement = $("<div>");
    tempElement.addClass(classToAppend);
    tempElement.text(myNBSP);
    $(elementString).append(tempElement);
}


function spawnRanger(arrayIndex) {
    tempPProfile = { "imageSource": "", "powerBase": 0, "attackPower": 0, "healthPoints": 0, "index": -1 };
    tempPProfile.imageSource = images.splice(Math.floor(Math.random() * images.length), 1)[0];
    tempPProfile.healthPoints = initialHealths.splice(Math.floor(Math.random() * initialHealths.length), 1)[0];
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
