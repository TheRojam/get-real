// DGB 08.09 Missing logic for when you click the picture you set the session variable "selectedMatch"
Session.setDefault("idPlayerSelected", undefined);
Template.header_game.events({
  'click .matchSelector': function(event) {
    $('.matchSelector').removeClass( "selectedMatch" );
    Session.set("selectedMatch", event.currentTarget.dataset.matchid);
    // check if used anywhere
    Session.set("idPlayerSelected", event.currentTarget.dataset.id);
    $(event.currentTarget).addClass( "selectedMatch" );
  }
});

Template.header_game.rendered = function () {
  $('.matchSelector').each(function (value, object){
    if ($(object) && $(object)[0].attributes["2"]
        && $(object)[0].attributes["2"].value === Session.get("selectedMatch")
    ) {
      $(object).addClass( "selectedMatch" );
    }
  });
};

Template.header_game.helpers({
  blurImage: function(matchId) {
    var numberTurns = Turns.find({ matchId: matchId }).count();
    var maxTurns = Games.findOne({}).maxTurns;
    if (numberTurns < maxTurns/3){
      return blurImagesOnGame(3);
    }
    if (numberTurns >= maxTurns/3 && numberTurns < maxTurns/1.5){
      return blurImagesOnGame(2);
    }
    if (numberTurns >= maxTurns/1.5 && numberTurns < maxTurns){
      return blurImagesOnGame(1);
    }
    if (numberTurns >= maxTurns){
      return blurImagesOnGame(0);
    }
  }
});
