var idIntervalEventStart;
Template.event.onCreated(function() {
  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
  self.autorun(function() {
    self.subscribe('CurrentGame');
    self.subscribe('Locations');

  });
  Session.set('backUrl', '/event'); // inside a game
});

Template.event.created = function() {
  idIntervalEventStart = 'notyet';
  Session.setDefault("gameFinished", undefined);
};

Template.event.helpers({
  userData: function()
  {
    var match = Matches.findOne({ bestMatch: true });
    if (match){
      var idUser = null;
      // Moved to rails Backend, as this alone can throw a rare bug, when player one doesn't see this screen -> player_locator broken || should be obsolete
      if ((match.playerOneId === Meteor.userId()) && !match.seedColor){
        var pattern = Math.floor((Math.random() * 100) + 1);
        Matches.update({ _id: match._id }, { $set: { seedColor: pattern } });
        idUser = match.playerTwoId;
      }
      ///////////////////////////
      if (match.playerOneId === Meteor.userId() && match.seedColor){
        idUser = match.playerTwoId;
      }
      if (match && match.playerTwoId === Meteor.userId()){
        idUser = match.playerOneId;
      }
    }
    var location;
    if (match && match.locationId){
      location = Matches.findOne({ bestMatch: true }).locationId;
      var tmp = {
        game: Games.findOne({ _id: Matches.findOne({ bestMatch: true }).gameId }),
        location: Locations.findOne({ _id: location })
      };
      return tmp;
    }
  },
  dateStart: function() {
    return moment(this.game.eventStart).format('HH:mm');
  },
  countdownClock: function() {
    if (this.game){
      var eventStart = this.game.eventStart,
          actualMoment = new Date();
      if (eventStart && actualMoment<eventStart){
        Session.set("gameFinished", undefined);
        var self = this,
            countdownTime = moment.duration(moment(eventStart).diff(Session.get("time")), 'milliseconds');
        Session.set("timeToFinishEvent", countdownTime);
        //console.log(moment(Session.get("time")));
        if (idIntervalEventStart ==='notyet') {
          idIntervalEventStart = Meteor.setInterval(function() {
            countdownTime = moment.duration(moment(eventStart).diff(Session.get("time")), 'milliseconds');
            Session.set("timeToFinishEvent", countdownTime);
            //console.log(eventStart + " - " + countdownTime.asSeconds());
            //Log.info(countdownTime.asSeconds());
            if (countdownTime.asSeconds()<=0) {
              Session.set("gameFinished", true);
              Meteor.clearInterval(idIntervalEventStart);
              //FlowRouter.go('/event_player_locator');
            }
          }, 1000);
        }
      }
      if (eventStart && actualMoment>eventStart){
        Session.set("gameFinished", true);
      }
      // DGB DGB 2014-12-16 05:08 COpied from game_waiting, this is asking
      // for an urgent refactoring
      if (Session.get("timeToFinishEvent")) {
        var hours = Session.get("timeToFinishEvent")._data.hours.toString();
        if (Session.get("timeToFinishEvent")._data.hours < 10) {
          hours = '0' + Session.get("timeToFinishEvent")._data.hours.toString();
        }
        var minutes = Session.get("timeToFinishEvent")._data.minutes.toString();
        if (Session.get("timeToFinishEvent")._data.minutes < 10) {
          minutes = '0' + Session.get("timeToFinishEvent")._data.minutes.toString();
        }
        var seconds = Session.get("timeToFinishEvent")._data.seconds.toString();
        if (Session.get("timeToFinishEvent")._data.seconds < 10) {
          seconds = '0' + Session.get("timeToFinishEvent")._data.seconds.toString();
        }
        // DGB 2014-12-16 03:43 Spaguetti code
        var s = "<span style='font-size:0.5em'>",
            cs = "</span>";
        return hours + s + 'H' + cs + ':' + minutes + s + 'M' + cs + ':' + seconds + s + 'S' + cs;
      } else {
        return "Ready";
      }
    }
  },
  eventStart: function() {
    if (Session.get("gameFinished")) {
      $("#find").prop("disabled", false);
      $("#find").attr('class', 'btn btn-primary btn-block');
      return true;
    } else {
      return false;
    }
  },
  dateCountdownClock: function() {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });

    game = Games.findOne({ _id: ticket.gameId });
    if (game && game.gameStart) {
      return CountdownClock(game.feedbackStart, "/date_screen", 'd'); // session is set inside countdouwn.js
    }
  }
});

Template.event.destroyed = function() {
  Session.set("timeToFinishEvent", undefined);
  Meteor.clearInterval(idIntervalEventStart);
};

Template.event.events({
  'click #profile_me': function() {
    Session.set("userUrl", "/profile_me");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #find': function() {
    Session.set("userUrl", "/event_player_locator");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #contribute-btn': function (event) {
    Session.set('backUrl', '/event');
    Session.set("userUrl", "/contribution");
    FlowRouter.go(Session.get("userUrl"));
  }
});


Template.event.onRendered(function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});

/*function onBackButtonDown(event) {
  return false;
}*/