var locale_var = 'de';

Template.side_nav.onRendered(function () {
  $('.sidenav').sidenav({ preventScrolling: false });
});

Template.side_nav.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');
    self.subscribe('EventRegistration');
  });
});

Template.side_nav.helpers({
  userData: function(){
    var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
    TAPi18n.setLanguage(userData.profile.language);
    locale_var = userData.profile.language;

    return userData;
  },
  //////////// not ready for a general menu
  // checkUserTicket: function(){
 //    var userTicket = Tickets.findOne({ userId: Meteor.userId(), $or: [{status: 'bought'}, {status: 'converted'}, {status: 'rejected'}]});
 //    console.log("UserTicket: " + userTicket);
 //
 //    // check if tickets are available and its status
 //    var ticket = Tickets.findOne({userId: Meteor.userId()}, { sort: { createdAt: -1 } });
 //    // Tickets.findOne({gameId: gameId, userId: userId, status: 'bought', areaId: areaId}) === undefined)
 //
 //    // var actualMoment = Session.get('time');
 //    var actualMoment = new Date();
 //      console.log("Servertime: " + actualMoment);
 //
 //    if (ticket){
 //      Log.info("Ticket: " + ticket.userId);
 //      var game = Games.findOne({ _id: ticket.gameId });
 //      console.log("Event-Starts: " + game.eventStart);
 //      console.log("Event-Finish: " + game.eventFinish);
 //      var ticketStatus = (ticket && (ticket.status === 'bought' || ticket.status === 'converted')) ? true:false;
 //      if (ticket && ticketStatus === true && game && (actualMoment < game.gameStart)) {
 //        console.log("/game_waiting");
 //        // return ("/game_waiting");
 //
 //      }
 //
 //      if ( userTicket ){
 //        return true;
 //      }else{
 //        false
 //      }
 //    }
 //  },
 checkInGame: function()
 {
   // checks, if menuitems need to be hidden (profile and history e.g.)
   var backUrl = Session.get("backUrl");
   if ( backUrl === "/game_waiting" || backUrl === "/chat_game" || backUrl === "/event" || backUrl === "/event_player_locator" || backUrl === "/date_screen" || backUrl === "/feedback_form" ){
     return false;
   }else{
     return true;
   }
 },
 checkGetRealDatingURL: function()
 {
   var userUrl = Session.get("userUrl");
   if ( userUrl === "/event_registration" || userUrl === "/game_waiting" || userUrl === "/chat_game" || userUrl === "/event" || userUrl === "/event_player_locator" || userUrl === "/date_screen" || userUrl === "/feedback_form" ){
     return true;
   }
 },
 checkDateHistoryURL: function()
 {
   if ( Session.get("userUrl") === "/date_history" ){
     return true;
   }
 },
  checkProcedureURL: function()
  {
    if ( Session.get("userUrl") === "/procedure" ){
      return true;
    }
  },
  checkPrinciplesURL: function()
  {
    if ( Session.get("userUrl") === "/principles" ){
      return true;
    }
  },
  checkContributionURL: function()
  {
    if ( Session.get("userUrl") === "/contribution" ){
      return true;
    }
  },
  checkInvitionsURL: function()
  {
    if ( Session.get("userUrl") === "/invitation" ){
      return true;
    }
  },
  checkSupportURL: function()
  {
    if ( Session.get("userUrl") === "/support" ){
      return true;
    }
  },
  checkProfileURL: function()
  {
    if ( Session.get("userUrl") === "/profile_me" ){
      return true;
    }
  }
});

Template.side_nav.events({
  'click #sn-to-getreal-dating': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-date-history': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/date_history");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-procedure': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/procedure");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-principles': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/principles");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-invite': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/invitation");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-contribution': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/contribution");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-support': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/support");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-to-profile': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set("userUrl", "/profile_me");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #sn-logout': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Session.set('errorRegister', undefined);
    Meteor.logout();
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  }
});