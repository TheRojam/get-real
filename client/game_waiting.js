var idInterval;
var locale_var;
var game;
Template.game_waiting.created = function () {
  idInterval = 'notyet';
  locale_var = getUserLanguage();
  //console.log("Created");
};

Template.game_waiting.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }

  var self = this;
  self.autorun(function() {
    self.subscribe('EventRegistration');
    self.subscribe('userData');
    self.subscribe('CurrentGame');
  });

  Session.set('backUrl', '/game_waiting'); // inside a game

});


Template.game_waiting.helpers({
  userData: function()
  {
      var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
      TAPi18n.setLanguage(userData.profile.language);
      locale_var = userData.profile.language;
      userData.reducedTickets = userData.availableTickets - 1;
      return userData;

  },
  game: function()
  {
      var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
      // console.log(ticket.gameId);
      game = Games.findOne({ _id: ticket.gameId });
      return game;
  },
  area: function()
  {
      var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
      // console.log(ticket.areaId );
      var area = Areas.findOne({ _id: ticket.areaId });
      return area;
  },
  profile: function()
  {
      var profile = Meteor.user().profile;
      return profile;
  },
  //DGB 2014-12-16 03:29 Not elegant at all, but it works
  // LPS check the format from event_registration -> one method multiple replies! TO DO
  eventMonth: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return moment(game.gameStart).locale(locale_var).format('MMMM');
    }
  },
  eventDay: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return moment(game.gameStart).locale(locale_var).format('D');
    }
  },
  gameDay: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return moment(game.gameStart).locale(locale_var).format('dd');
    }
  },
  gameStart: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return moment(game.gameStart).locale(locale_var).format('HH:mm');
    }
  },
  gameFinish: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameFinish) {
      return moment(game.gameFinish).locale(locale_var).format('HH:mm');
    }
  },
  eventStart: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return moment(game.eventStart).locale(locale_var).format('HH:mm');
    }
  },
  eventFinish: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return moment(game.eventFinish).locale(locale_var).format('HH:mm');
    }
  },
  message: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.message) {
      return game.message;
    }
  },
  countdownClock: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      if (moment(game.gameStart).diff(moment(), 'days') > 0){
        // shows also days
        return CountdownClock(game.gameStart, "/redirect", 'd');   // the ticket status is determined later
      }else{
        // shows only hours
        return CountdownClock(game.gameStart, "/redirect", 'h');   // the ticket status is determined later
      }
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

Template.game_waiting.events({
  'click #exit-game-btn': function (event) {
    var ticket = Tickets.findOne({userId: Meteor.userId()}, { sort: { createdAt: -1 } });
    Meteor.call("deleteTicket", ticket._id, Meteor.userId(), function () {
      Session.set("userUrl", "/event_registration");
      FlowRouter.go(Session.get("userUrl"));
    });
  },
  'click #contribute-btn': function (event) {
    Session.set("userUrl", "/contribution");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #read-principles': function (event) {
    Session.set("userUrl", "/principles");
    FlowRouter.go(Session.get("userUrl"));
  }
});


Template.game_waiting.destroyed = function() {
  Session.set("timeToGame", undefined);
  Meteor.clearInterval(idInterval);
};

Template.game_waiting.onRendered(function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});


/*function onBackButtonDown(event) {
  return false;
}*/