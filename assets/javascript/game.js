// init
var powerBases = [4, 6, 8, 10],
    CONST_counterAttack = 25,
    images = ["blue.JPG", "red.JPG", "pink.JPG", "green.JPG"],
    initialHealths = [125, 150, 175, 200],
    myCtr = 0,
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
        var imageRanger = $("<img>");
        imageRanger.addClass("ranger-image");
        imageRanger.attr("id", "ranger" + i);
        imageRanger.attr("src", "assets/images/" + playerProfiles[i].imageSource);
        imageRanger.attr("data-healthpoints", playerProfiles[i].healthPoints);
        $("#player-on-deck").append(imageRanger);
    }
    $("#top-text").text("Click a player for yourself ...");
}

profileCount = images.length;
// spawn four ranger profiles into the player profile array
for (i = 0; i < profileCount; i++) {
    playerProfiles.push(spawnRanger());
}
initializeGame();