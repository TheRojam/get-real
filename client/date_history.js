var idIntervalEventFinished;

Template.date_history.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
  self.autorun(function() {
    self.subscribe('DateHistory');
  });
  Session.set('backUrl', '/event_registration'); // date_history is not shown during games
});

Template.date_history.created = function() {
/*  idIntervalEventFinished = 'notyet';
  Session.set("timeToFinishEvent", undefined);*/
};

Template.date_history.helpers({
  oldDates: function(){
    var allTickets = Tickets.find({ userId: Meteor.userId(), status: "finished" });
/*    console.log("allTickets: "+allTickets.count());*/
    var gameIds  = _.pluck(allTickets.fetch(), 'gameId');
    var oldMatches = Matches.find({ gameId: {$in: gameIds }});
    var oldDates = oldMatches.fetch().map(findOldDates);

/*    console.log("oldMatches: "+ oldMatches.count());*/
/*    console.log("oldDates: "+ oldDates.length);*/
    return oldDates;

  },
  playerColor: function(seedColor) {
    if (seedColor){
      var seed = seedColor;
      var color = Math.floor((Math.abs(Math.sin(seed) * 16777215)) % 16777215).toString(16);
      //Log.info(color);
      while (color.length < 6) {
        color = '0' + color;
      }
      return color;
    }
  },
  blurImage: function(matchId) {
    var turns = Turns.find({ matchId: matchId }).fetch();
    var numberTurns = turns.length;
    var matchFinished = Matches.findOne({ _id: turns[0].matchId }).isFinished;
    var maxTurns = Games.findOne({ _id: turns[0].gameId }).maxTurns;
    if (numberTurns < maxTurns/3){
      return blurImagesOnGame(3);
    }
    if (numberTurns >= maxTurns/3 && numberTurns < maxTurns/1.5){
      return blurImagesOnGame(2);
    }
    if (numberTurns >= maxTurns/1.5 && numberTurns <= maxTurns && !matchFinished){
      return blurImagesOnGame(1);
    }
    if (numberTurns = maxTurns && matchFinished){
      return blurImagesOnGame(0);
    }
  }

});

Template.date_history.events({
  'click .chat_history': function (event) {
    Session.set('backUrl', '/date_history');
    Session.set("selectedMatch", new Mongo.ObjectID(event.currentTarget.dataset.matchid));
    Session.set("userUrl", "/chat_history");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #back-btn': function (event) {
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  }
});

// finds the otherPlayer and his data

var findOldDates = function (match) {
  if ( match.playerOneId === Meteor.userId() ){
    var user = Meteor.users.findOne({_id: match.playerTwoId});
  }else{
    var user = Meteor.users.findOne({_id: match.playerOneId});
  }
/*  console.log("Found old Date: "+user.profile.name);*/
  user.match = match;
  return user;
}

Template.date_history.onRendered(function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});

/*function onBackButtonDown(event) {
  Session.set("userUrl", "/event_registration");
  FlowRouter.go(Session.get("userUrl"));
}*/