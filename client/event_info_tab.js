var locale_var = 'de';


Template.event_info_tab.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('EventRegistration');
    self.subscribe('userData');
    self.subscribe('EventBookings');
  });
  Session.set('backUrl', '/event_info_tab'); // outside a game, user get's always back to event_info_tab
});

Template.event_info_tab.onRendered(function () {

});

Template.event_info_tab.helpers({
  userData: function()
  {
      var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
      TAPi18n.setLanguage(userData.profile.language);
      locale_var = userData.profile.language;

      return userData;

  },
  hasTicket: function() {
    var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
    if ( userData.availableTickets > 0 ){
      return true;
    }else{
      return false;
    }
  },
  area: function()
  {
    var areas = Areas.find({ status: 'enabled', context: Meteor.user().context });
    var games = Games.find({ matchesCreated: false, gameStart: { $gt: new Date() } });

    return areas.fetch();
  },
  games: function()
  {
    var games = Games.find({ matchesCreated: false, gameStart: { $gt: new Date() } }, {limit: 3} );
    return games;
  },
  selectedArea: function () {
    return (Session.get('idAreaSelected') && Session.get('idAreaSelected') !== '-1') ? true:false;
  },
  ///// should maybe show the next available game if full (now shows error)
  gameCapacity: function (gameId) {
   //   var game = Games.findOne({ areaId: new Mongo.ObjectID(Session.get('idAreaSelected')), matchesCreated: false, gameStart: { $gt: new Date() } }, {sort: {gameStart: 1}});
   //   var area = Areas.findOne({ _id: new Mongo.ObjectID(Session.get('idAreaSelected')) });
     var game = Games.findOne({ _id: gameId});
     var area = Areas.findOne({ _id: game.areaId });

      if (game) {

        //////////////////////////// similar code as booking_progress /////////////////////
        // check for empty capacity
        var userGender = Meteor.user().profile.gender;
        var userGenderWanted = Meteor.user().profile.genderWanted;
    /*    console.log("userGender: " + userGender);*/
    /*    console.log("userGenderWanted: " + userGenderWanted);*/
        var tables = 0;
        moment.locale('en'); // important for finding the fields in english (e.g. location.maxThursday)
        var locations = Locations.find({ status: 'enabled', areaId: area._id });  // all locations with their reservations
    /*    console.log("locations: " + locations.count());*/
        if (locations) {
          locations.forEach(function(location) {
            var locationTables = eval('location.max' + moment(game.gameStart).format("dddd"));
            tables = tables + locationTables;
/*            console.log("tables: " + tables);*/
          });
        }
        var tickets = Tickets.find({ status: "bought", gameId: game._id });
    /*    console.log("tickets: " + tickets.count());*/
        var userIds = [];
        if (tickets) {
          tickets.forEach(function(ticket) {
            userIds.push(ticket.userId);
          });
        } else {
          userIds = '';
        }

    /*    console.log("userIds: " + userIds);*/
          var appliedUsers = Meteor.users.find({_id: {$in: userIds}, "profile.gender": userGender, "profile.genderWanted": userGenderWanted }).count();

          if (appliedUsers === tables){
/*            console.log(appliedUsers + " : " + tables);*/
            return false;
          }else{
            return true;
          }

    /*      console.log("sameUsers: " + sameUsers);*/

        //////////////////////////// similar code as booking_progress /////////////////////
      }
  },
  selectedAreaHasGames: function () {
    if (Session.get('idAreaSelected') && Session.get('idAreaSelected') !== '-1') {
      var games = Games.find({ areaId: new Mongo.ObjectID(Session.get('idAreaSelected')), matchesCreated: false, gameStart: { $gt: new Date() } }, {limit: 3, sort: {gameStart: 1}}).fetch();
      var area = Areas.findOne({ _id: new Mongo.ObjectID(Session.get('idAreaSelected')) });

      var returnGames = []

      games.forEach(function(game) {
/*        console.log("id: " + game._id);*/
        returnGames.push({
          eventMonth: moment(game.gameStart).locale(locale_var).format('MMMM'),
          eventDay: moment(game.gameStart).locale(locale_var).format('D'),
          gameDay: moment(game.gameStart).locale(locale_var).format('dd'),
          gameDayLong: moment(game.gameStart).locale(locale_var).format('dddd'),
          gameStart: moment(game.gameStart).locale(locale_var).format('HH:mm'),
          eventStart: moment(game.eventStart).locale(locale_var).format('HH:mm'),
          gameFinish: moment(game.gameFinish).locale(locale_var).format('HH:mm'),
          eventFinish: moment(game.eventFinish).locale(locale_var).format('HH:mm'),
          message: game.message,
          gameId: game._id,
          gameIdStr: "" + game._id._str,
          gameModal: "modal-apply-getreal-" + game._id._str,
          areaName: area.name
        });
      });

      if (returnGames) {

        Session.set("gameShowed", returnGames[0]);
        return returnGames;
      }
    } else if (Session.get('idAreaSelected') === '-1') {
      return true;
    } else {
      return false;
    }
  },
  inTutorial: function() {
    if ( Meteor.user().context == "tutorial" ) {
      return true;
    }else{
      return false;
    }
  },
  firstTime: function() {
    var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
    if ( userData.firstTimeEvent !== undefined ){
      return userData.firstTimeEvent;
    }else{
      return true;
    }
  }

});

Template.event_info_tab.events({
  'click .modal-apply-getreal-btn': function (event, template) {
    /* DGB 2014-09-19 This will eventually migrate to a buyTicket method */
    event.preventDefault();
    var area = $('#area').val();
    var gameId = new Mongo.ObjectID(event.currentTarget.value);
/*    console.log(gameId);*/
    var game = Games.findOne({ _id: gameId });
/*    console.log(game._id);*/
/*    var game = Session.get("gameShowed");*/
    if (game && game._id) {
      Meteor.call("addUserToGame", Meteor.userId(), game._id, new Mongo.ObjectID(area), function (err, result) {
        if (err) {
/*          console.log(err);*/
        }
/*        console.log(result);*/
        if (result && result !== null) {
          Session.set("ticketBoughtByUser", result);
          Session.set("userUrl", "/game_waiting");
          FlowRouter.go(Session.get("userUrl"));
        }
      });
    }

  },
  'change #area': function (event, template){
    //console.log(template.$('#area').val());
    if (template.$('#area').val() === "new-area"){
      Session.set("userUrl", "/contribution");
      FlowRouter.go(Session.get("userUrl"));
    }else{
      Session.set('idAreaSelected', template.$('#area').val());
    }
  },
  'click #to_profile': function () {
    Session.set("userUrl", "/profile_me");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #modal-first-time-event-btn': function () {
    Meteor.users.update( Meteor.userId(), {$set: { "firstTimeEvent": false }} );
  },
  'click .modal-trigger': function () {
    $('.modal').modal();
  }
});



Template.event_info_tab.rendered = function () {
  $('.tabs').tabs({swipeable: true} );
  $('.modal').modal();

  $('.tooltipped').tooltip();
  //console.log(typeof $('#area').val());
/*  if($('#area').val() !== "-1" && $('#area').val() !== undefined){
    Session.set('idAreaSelected', $('#area').val());
  }else{
    Session.set('idAreaSelected', '-1');
  }*/
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
};

/*function onBackButtonDown(event) {
// nothing should happen here
}*/
