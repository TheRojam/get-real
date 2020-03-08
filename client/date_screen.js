var idIntervalEventFinished;

Template.date_screen.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
  self.autorun(function() {
    self.subscribe('CurrentGame');
    self.subscribe('userData');
    self.subscribe('Turns', getUserLanguage());
  });

  Session.set('backUrl', '/date_screen'); // inside a game
});

Template.date_screen.created = function() {
  idIntervalEventFinished = 'notyet';
  Session.set("timeToFinishEvent", undefined);
};

Template.date_screen.helpers({
  userData: function()
  {
    var match = Matches.findOne({ bestMatch: true });
    if (match && match.seedColor) {
      var userData;
      if (match.playerOneId === Meteor.userId()) {
        userData = Meteor.users.findOne({ _id: match.playerTwoId });
      } else if (match.playerTwoId === Meteor.userId()) {
        userData = Meteor.users.findOne({ _id: match.playerOneId });
      }
      // console.log(userData);
      if (userData !== null) {
        var temp = {
          match: match,
          game: Games.findOne({ _id: match.gameId}),
          user: userData,
          ticket: Tickets.findOne({}, { sort: { createdAt: -1 } }),
          pattern: match.seedColor
        };
        // console.log("Game: " + temp.game._id);
        return temp;
      }
    }
  },
  playerColor: function() {
    if (this.pattern){
      var seed = this.pattern;
      var color = Math.floor((Math.abs(Math.sin(seed) * 16777215)) % 16777215).toString(16);
      //Log.info(color);
      while (color.length < 6) {
        color = '0' + color;
      }
      return color;
    }
  },

  stillDate: function() {
    now = Date.now();
    if (this.game.eventFinish && this.game.eventFinish > now) {
      return true
    }
  },

  dateCountdownClock: function() {
    now = Date.now();
    if (this.game.eventFinish) {
      return CountdownClock(this.game.eventFinish, "/redirect", 'h'); // redirects to same page to reload Date.now()
    }
  },

  feedbackCountdownClock: function() {
    if (this.game.feedbackStart) {
      return CountdownClock(this.game.feedbackStart, "/feedback_form", 'h'); // session is set inside countdouwn.js
    }
  },
  inTutorial: function() {
    if ( Meteor.user().context == "tutorial" ) {
      return true;
    }else{
      return false;
    }
  }
});

Template.date_screen.events({
  'click #chat_history': function (event) {
    Session.set('backUrl', '/date_screen');
    Session.set("userUrl", "/chat_history");
    FlowRouter.go(Session.get("userUrl"));
  }
});

Template.date_screen.onRendered(function() {
  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };
});

function onBackButtonDown(event) {
  return false;
}