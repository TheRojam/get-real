var idIntervalEventFinished;

Template.event_player_locator.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
  self.autorun(function() {
    self.subscribe('CurrentGame');
    self.subscribe('userData');
  });
  Session.set('backUrl', '/event_player_locator'); // inside a game

});



Template.event_player_locator.created = function() {
  idIntervalEventFinished = 'notyet';
  Session.set("timeToFinishEvent", undefined);
};

Template.event_player_locator.helpers({
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
          game: Games.findOne({}),
          user: userData,
          ticket: Tickets.findOne({}, { sort: { createdAt: -1 } }),
          pattern: match.seedColor
        };
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
  dateCountdownClock: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });

    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return CountdownClock(game.feedbackStart, "/date_screen", 'd'); // session is set inside countdouwn.js
    }
  },
  inTutorial: function() {
    if ( Meteor.user().context == "tutorial" ) {
      return true;
    }else{
      return false;
    }
  }
  // countdownClock: function() {
//         console.log("lvl0");
//         game = Games.findOne({});
//     if (game && game.eventFinish) {
//       console.log("lvl1");
//           eventFinish = game.eventFinish,
//           actualMoment = Session.get("time");
//       if (eventFinish && actualMoment < eventFinish) {
//       console.log("lvl2");
//         Session.set("timeToFinishEvent", undefined);
//         var countdownTime = moment.duration(moment(eventFinish).diff(Session.get("time")), 'milliseconds');
//         Session.set("timeToFinishEvent", countdownTime);
//         console.log(moment(Session.get("time")));
//         if (idIntervalEventFinished ==='notyet') {
//       console.log("lvl3");
//           idIntervalEventFinished = Meteor.setInterval(function() {
//             countdownTime = moment.duration(moment(eventFinish).diff(Session.get("time")), 'milliseconds');
//             Session.set("timeToFinishEvent", countdownTime);
//             Log.info(countdownTime.asSeconds());
//             if (countdownTime.asSeconds() <= 0) {
//       console.log("lvl4");
//               Session.set("timeToFinishEvent", true);
//               Meteor.clearInterval(idIntervalEventFinished);
//               Tickets.update({ _id: self.ticket._id }, { $set: { status: 'feedback' } });
//               // FlowRouter.go('/event_registration');
//               Session.set("userUrl", "/feedback_form");
//               FlowRouter.go(Session.get("userUrl"));
//             }
//           }, 1000);
//         }
//       } else if (eventFinish && actualMoment>eventFinish && this.ticket) {
//         Tickets.update({ _id: this.ticket._id }, { $set: { status: 'feedback' } });
//         // FlowRouter.go('/event_registration');
//         Session.set("userUrl", "/feedback_form");
//         FlowRouter.go(Session.get("userUrl"));
//       }
//     } else {
//       // FlowRouter.go('/event_registration');
//       Session.set("userUrl", "/event_registration");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//   },
});

Template.event_player_locator.destroyed = function() {
  Session.set("timeToFinishEvent", undefined);
  Meteor.clearInterval(idIntervalEventFinished);
};

Template.event_player_locator.events({
  'click #event': function() {
    Session.set("userUrl", "/event");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #date_screen': function() {
    Session.set("userUrl", "/date_screen");
    FlowRouter.go(Session.get("userUrl"));
  }
});

Template.event_player_locator.onRendered = function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
};

/*
function onBackButtonDown(event) {
  Session.set("userUrl", "/event");
  FlowRouter.go(Session.get("userUrl"));
}*/