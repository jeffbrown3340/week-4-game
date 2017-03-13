// init
var powerBases = [4, 6, 8, 10],
    CONST_counterAttack = 25,
    images = ["blue.JPG", "red.JPG", "pink.JPG", "green.JPG"],
    initialHealths = [125, 150, 175, 200],
    myCtr = 0,
    myNBSP = String.fromCharCode(160),
    playerProfiles = [],
    profileCount;

$("body").on("click", ".ranger-image", function() {
    console.log(arguments);
    console.log(this);
    console.log(this.id);
});

function spawnRanger () {
    tempPProfile = {"imageSource": "", "powerBase":0, "attackPower": 0, "healthPoints": 0};
    tempPProfile.imageSource = images.splice(Math.floor(Math.random() * images.length), 1)[0];
    tempPProfile.healthPoints = initialHealths.splice(Math.floor(Math.random() * initialHealths.length), 1)[0];
    return tempPProfile;
}

function initializeGame() {
    for (var i = 0; i < playerProfiles.length; i++) {
        var tempElement = $("<div>");
        tempElement.addClass("ranger-image-object");
        tempElement.attr("id", "ranger" + i);
        $("#player-on-deck").append(tempElement);
        tempElement = $("<div>");
        tempElement.addClass("ranger-image-frame")
        tempElement.attr("id", "ranger" + i + "-frame");
        $("#ranger" + i).append(tempElement);
        tempElement = $("<img>");
        tempElement.addClass("ranger-image");
        tempElement.attr("src", "assets/images/" + playerProfiles[i].imageSource);
        tempElement.attr("data-healthpoints", playerProfiles[i].healthPoints);
        $("#ranger" + i + "-frame").append(tempElement)
        tempElement = $("<div>");
        tempElement.addClass("ranger-image-points");
        tempElement.attr("id", "ranger" + i + "-points-text");
        tempElement.text(playerProfiles[i].healthPoints);
        $("#ranger" + i + "-frame").append(tempElement);
        tempElement = $("<div>");
        tempElement.addClass("ranger-spacer");
        tempElement.text(myNBSP);
        $("#player-on-deck").append(tempElement);

    }
    $("#top-text").text("Click a player for yourself ...");
}

profileCount = images.length;
// spawn four ranger profiles into the player profile array
for (i = 0; i < profileCount; i++) {
    playerProfiles.push(spawnRanger());
}
initializeGame();