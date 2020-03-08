// Main problem is with DB subscirption of user (logged in etc.) and ticket (status)


// brings the user to the URL he should be based on the Session
var goToSessionUrl = function () {
  console.log("Session userUrl: " + Session.get("userUrl"));
/*  console.log("FlowRouter.url: " + FlowRouter.url());*/
  // first check if user is logged in > Session
  // TO DO sems like User is not available in the beginning
  if (!Meteor.userId()) {
    // check for reset_password
    if ( Session.get("userUrl") === "/reset_password" ){
      console.log("User wants to reset password");
      FlowRouter.go(Session.get("userUrl"));
    }
    console.log("User not logged in");
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  }

  // Then check if User has a set URL in Session and sends to redirect page if necessary.
  if (!Session.get("userUrl")) {
    console.log("Send to redirect to expected route");
    Session.set("userUrl", "/redirect");
    FlowRouter.go(Session.get("userUrl"));
    // setNewUserUrl();
  }

  // Check, if the current session URL is the one where the user is at the moment
  // TO DO not sure if it works
  var cur = FlowRouter.current().path;
  if (Session.get("userUrl") !== cur) {
    console.log("Is " + cur + " instead of " + Session.get("userUrl"));
    FlowRouter.go(Session.get("userUrl"));
  }
};




// All routes where the user is not logged in yet.

FlowRouter.route('/', {
  action: function () {
    BlazeLayout.render('home');
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/registration', {
  action: function () {
    BlazeLayout.render('registration');
  }
});

FlowRouter.route('/redirect', {
  action: function () {
    BlazeLayout.render('redirect');
  }
});

// FlowRouter.route("/redirect", {
//     subscriptions : function(params, queryParams){
//         this.register("ticket", Meteor.subscribe("userTicket"));
//     },
//
//     action: function () {
//         BlazeLayout.render("redirect");
//     }
// });

// All routes where the user is logged in but not in a game yet.

FlowRouter.route('/not_approved', {
  action: function () {
    BlazeLayout.render('not_approved');
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/SMS_verification', {
  action: function () {
    BlazeLayout.render('SMS_verification');
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/reset_password', {
  action: function () {
    BlazeLayout.render('reset_password');
  }
});

FlowRouter.route('/change_password', {
  action: function () {
    BlazeLayout.render('change_password');
  }
});

FlowRouter.route('/principles', {
  action: function () {
    BlazeLayout.render('principles');
  },
  triggersEnter: [goToSessionUrl]
});


FlowRouter.route('/support', {
  action: function () {
    BlazeLayout.render('support');
  },
  triggersEnter: [goToSessionUrl]
});


FlowRouter.route('/procedure', {
  action: function () {
    BlazeLayout.render('procedure');
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/rejected_ticket', {
  action: function () {
    BlazeLayout.render('rejected_ticket', {content: "rejected_ticket"});
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/profile_me', {
  action: function()
  {
    BlazeLayout.render('profile_me', {content: "profile_me"});
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/event_registration', {
  action: function()
  {
    BlazeLayout.render('event_registration', {content: "event_registration"});
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/game_waiting', {
  action: function()
  {
    BlazeLayout.render('game_waiting', {content: "game_waiting"});
  },
  triggersEnter: [goToSessionUrl]
});


// All routes where the user is logged in and is in a game.

FlowRouter.route('/chat_game', {
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  action: function()
  {
    BlazeLayout.render('chat_game', {content: "chat_game"});
  },
  triggersEnter: [goToSessionUrl]
});

FlowRouter.route('/game', {
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  action: function()
  {
    BlazeLayout.render('game', {content: "game"});
  },
  triggersEnter: [goToSessionUrl]
});

// chat-menu and priorization
FlowRouter.route('/chat_menu', {
  action: function()
  {
    BlazeLayout.render('chat_menu', {content: "chat_menu"});
  },
  triggersEnter: [goToSessionUrl]
});

// invitations page
FlowRouter.route('/invitation', {
  action: function()
  {
    BlazeLayout.render('invitation', {content: "invitation"});
  },
  triggersEnter: [goToSessionUrl]
});

// contribution page
FlowRouter.route('/contribution', {
  action: function()
  {
    BlazeLayout.render('contribution', {content: "contribution"});
  },
  triggersEnter: [goToSessionUrl]
});

// Send the user to the date
FlowRouter.route('/event', {
  action: function()
  {
    BlazeLayout.render('event', {content: "event"});
  },
  triggersEnter: [goToSessionUrl]
});

// SHows the user his date_history
FlowRouter.route('/date_history', {
  action: function()
  {
    BlazeLayout.render('date_history', {content: "date_history"});
  },
  triggersEnter: [goToSessionUrl]
});

// Shows the user his/her date
FlowRouter.route('/event_player_locator', {
  action: function () {
    BlazeLayout.render('event_player_locator', {content: "event_player_locator"});
  },
  triggersEnter: [goToSessionUrl]
});


// SHows the user one chat_history
FlowRouter.route('/chat_history', {
  action: function()
  {
    BlazeLayout.render('chat_history', {content: "chat_history"});
  },
  triggersEnter: [goToSessionUrl]
});

// Shows the user date principles and icebreakers
FlowRouter.route('/date_screen', {
  action: function () {
    BlazeLayout.render('date_screen', {content: "date_screen"});
  },
  triggersEnter: [goToSessionUrl]
});

// Asks the user for feedback
FlowRouter.route('/feedback_form', {
  action: function()
  {
    BlazeLayout.render('feedback_form', {content: "feedback_form"});
  },
  triggersEnter: [goToSessionUrl]
});


// // ////////////////////////////////////////////////////////////////////////////////////////////////
//
// // Method that checks to where the user should be reidrected.
// // this method should only be necessary, if the user broke his current position (e.g. back button)
// var setNewUserUrl = function () {
//     console.log("Checking for the correct route - setNewUserUrl");
//     FlowRouter.wait();
//
//   // check if user is approved -> not_approved screen
//   if (Meteor.user() && Meteor.user().approved !== true){
//     if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photo){
//         console.log("User is not approved by admins yet");
//         Session.set("userUrl", "/not_approved");
//         FlowRouter.go(Session.get("userUrl"));
//     }
//   }
//
//   // check if profile is complete
//   if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photoName && Meteor.user().profile.birthYear && Meteor.user().profile.genderWanted && Meteor.user().profile.language && Meteor.user().profile.gender && Meteor.user().profile.name){
//     return true;
//   } else {
//     console.log("Profile incomplete");
//     Session.set("userUrl", "/profile_me");
//     FlowRouter.go(Session.get("userUrl"));
//   }
//
//   // check if tickets are available and its status
//   var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//   console.log("Ticket: " + ticket);
//
//   var actualMoment = Session.get('time');
//
//   if (ticket){
//     var game = Games.findOne({ _id: ticket.gameId });
//
//     // check if user's game is already finished
//     if (Meteor.userId() && ticket && ticket.status === 'finished' && game && actualMoment > game.feedbackFinish){
//       Session.set("userUrl", "/event_registration");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//     // check if user's game is in feedback mode -> feedback form
//     if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.feedbackStart && actualMoment < game.feedbackFinish){
//       // NEED TO ADD check if feedback has been given
//       Session.set("userUrl", "/feedback_form");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//     //////////////////////////////////////////////////////////////////////////////
//     // MISSING a screen for ON Date with icebreaker gamecards and panic button
//     //////////////////////////////////////////////////////////////////////////////
//
//     // check if user's game is in the date -> find candiDate
//     // TO DO add check bestMatch functionality, more accurate
//     if (Meteor.userId() && ticket && ticket.status === 'converted' && game && game.datesCreate === true && actualMoment > game.eventStart){
//       Session.set("userUrl", "/event_player_locator");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//     // check if user's game is between the 4play and the date -> find location
//     // TO DO add check bestMatch functionality, more accurate
//     if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.gameFinish && actualMoment < game.eventStart) {
//       Session.set("userUrl", "/event");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//     // check if user is in 4play (game) -> go to game
//     if (Meteor.userId() && ticket && ticket.status === 'converted' && ticket.matchingpointsCreated === true && game && actualMoment > game.gameStart && actualMoment < game.gameFinish) {
//       Session.set("userUrl", "/game");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//     // check if user is before 4play (game) with a ticket -> go to game_waiting
//     var ticketStatus = (ticket && (ticket.status === 'bought' || ticket.status === 'converted')) ? true:false;
//     if (ticket && ticketStatus === true && game && (actualMoment < game.gameStart)) {
//       console.log("/game_waiting");
//       Session.set("userUrl", "/game_waiting");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//     // check if user's ticket has been rejected -> go to game_waiting
//     if (ticket && ticket.status === 'rejected'){
//       Session.set("userUrl", "/rejected_ticket");
//       FlowRouter.go(Session.get("userUrl"));
//     }
//
//   } else {
//       // no ticket -> event registration
//       console.log("No ticket -> event registration");
//       Session.set("userUrl", "/event_registration");
//       FlowRouter.go(Session.get("userUrl"));
//   }
// };
