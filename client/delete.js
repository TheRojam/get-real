// // Main problem is with DB subscirption of user (logged in etc.) and ticket (status)
//
//
// // brings the user to the URL he should be based on the Session
// var goToSessionUrl = function () {
//
//   // first check if user is logged in > Session
//   // TO DO sems like User is not available in the beginning
//   if (!Meteor.userId()) {
//     console.log("User not logged in");
//     Session.set("userUrl", "/");
//     FlowRouter.go(Session.get("userUrl"));
//   }
//
//   // Then check if User has a set URL in Session
//   if (!Session.get("userUrl")) {
//     console.log("no userUrl");
//     setNewUserUrl();
//   }
//
//   // Check, if the current session URL is the one where the user is at the moment
//   // TO DO not sure if it works
//   var cur = FlowRouter.current().path;
//   if (Session.get("userUrl") !== cur) {
//     console.log(Session.get("userUrl") + " instead of " + cur);
//     FlowRouter.go(Session.get("userUrl"));
//   }
// };
//
//
//
//
// /**
//  * [userProfileComplete description]
//  * @return {[type]} [description]
//  */
// var userProfileComplete = function() {
//
//   if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photoName && Meteor.user().profile.birthYear && Meteor.user().profile.genderWanted && Meteor.user().profile.language && Meteor.user().profile.gender && Meteor.user().profile.name){
//     return true;
//   } else {
//     return false;
//   }
// };
//
//
// /**
//  * [userApproved description]
//  * @return {[type]} [description]
//  */
// var userApproved = function() {
//
//   if (Meteor.user() && Meteor.user().approved === false){
//     if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photo){
//         FlowRouter.go('/not_approved');
//     }else {
//       FlowRouter.go('/profile_me');
//     }
//   }
//   if (Meteor.user() && Meteor.user().approved === true) {
//     //if (FlowRouter.url() === '/not_approved') {
//
//       FlowRouter.go('/event_registration');
//
//   //  } else {
//
//     //  FlowRouter.go(FlowRouter.url());
//
//   //  }
//   }
//
// };
//
//
// /**
//  * [ticketRejected description]
//  * @return {[type]} [description]
//  */
// var ticketRejected = function() {
//   if (this.ready()) {
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     if (ticket && ticket.status === 'rejected') {
//       FlowRouter.go('/rejected_ticket');
//       this.next();
//     } else if (
//         ticket &&
//         ticket.status === 'converted' &&
//         FlowRouter.url() === '/rejected_ticket'
//       ) {
//       FlowRouter.go('/game_waiting');
//     } else {
//       FlowRouter.go(FlowRouter.url());
//     }
//   }
// };
//
// /**
//  * [userWorkFlowControl description]
//  * @return {[type]} [description]
//  */
// var filterEventRegistration = function() {
//
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     var game;
//     var server = Session.get('time');
//     if (ticket) {
//       game = Games.findOne({ _id: ticket.gameId });
//     }
//     if (ticket && ticket.status === 'rejected' && game && game.matchesCreated === true && game && (server < game.gameFinish)) {
//       // console.log("Ticket rejected");
//       FlowRouter.go('/rejected_ticket');
//     }
//     var ticketStatus = (ticket && (ticket.status === 'bought' || ticket.status === 'converted')) ? true:false;
//     if (ticket && ticketStatus === true && game && (server < game.gameStart)) {
//       // console.log("Ticket game waiting");
//       FlowRouter.go('/game_waiting');
//     }
//     if (ticket && ticketStatus === true && ticket.matchingpointsCreated === true && game && (server > game.gameStart)) {
//       // console.log("Ticket game waiting");
//       FlowRouter.go('/game');
//     }
//     if (ticket && ticket.status === 'converted' && game && (server > game.gameFinish) && (server < game.eventStart)) {
//       // console.log('User has a ticket and the game has started already');
//       FlowRouter.go('/event');
//     }
//
// };
//
// /**
//  * [filterGameWaiting description]
//  * @return {[type]} [description]
//  */
// var filterGameWaiting = function() {
//
//     var ticket =  Tickets.findOne({}, { sort: { createdAt: -1 } });
//     // console.log("Ticket game: ", ticket);
//     if (ticket && (ticket.status === 'bought' || ticket.status === 'converted' || ticket.status === 'rejected')){
//       // console.log("TICKET for game waiting: ", ticket.gameId._str, ticket.status);
//       var game = Games.findOne({ _id: ticket.gameId});
//       var server = Session.get('time');
//       if (!game) {
//         FlowRouter.go('/event_registration');
//
//       }
//       if (Meteor.userId() && ticket && ticket.status === 'converted' && ticket.matchingpointsCreated === true && game && server > game.gameStart && server < game.eventFinish) {
//         Log.info('User has a ticket and the game has started already');
//         FlowRouter.go('/game');
//       }
//       if (Meteor.userId() && ticket && ticket.status === 'rejected' && game && server > game.gameStart) {
//         Log.info('User has a rejected ticket');
//         FlowRouter.go('/rejected_ticket');
//       }
//       if (Meteor.userId() && ticket && ticket.status === 'converted' && game && server > game.gameFinish && server < game.eventStart) {
//         Log.info('User has a ticket and the game has started already');
//         FlowRouter.go('/event');
//       }
//       if (Meteor.userId() && ticket && ticket.status === 'converted' && game && server > game.eventStart && server < game.eventFinish) {
//         Log.info('User has a ticket and the game has started already');
//         FlowRouter.go('/event_player_locator');
//       }
//       if (Meteor.userId() && ticket && game && (server > game.eventFinish)) {
//         Log.info('User has a ticket and the game has started already');
//         FlowRouter.go('/event_registration');
//
//       }
//     } else if (!ticket) {
//       FlowRouter.go('/event_registration');
//
//     }
//
// };
//
// /**
//  * [filterGame description]
//  * @return {[type]} [description]
//  */
// var filterGame = function() {
//
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     // console.log("Ticket game: ", ticket);
//     if (ticket){
//       var game = Games.findOne({ _id: ticket.gameId });
//       var actualMoment = Session.get('time');
//       var match = Matches.findOne({ gameId: ticket.gameId });
//       //console.log(TimeSync.serverTime(actualMoment));
//       if (Meteor.userId() && ticket && ticket.status !== 'rejected' &&
//         ticket.status !== 'bought' && game && actualMoment < game.gameStart){
//         //Log.info('User has a ticket and the game has not started yet');
//         //If the game is open redirect to game, for testing we redirect to /game
//         FlowRouter.go('/game_waiting');
//       }
//       if (Meteor.userId() && ticket && ticket.status !== 'rejected' &&
//         ticket.status !== 'bought' && match && game && actualMoment > game.gameFinish &&
//         actualMoment < game.eventStart){
//         //Log.info('Game is finished, we go to the chat_menu');
//         //If the game is open redirect to game, for testing we redirect to /game
//         FlowRouter.go('/event_player_locator');
//       }
//       if (ticket && ticket.status === 'rejected' || ticket.status === 'bought'){
//         FlowRouter.go('/rejected_ticket');
//       }
//       if (!match && ticket && ticket.status !== 'rejected'){
//         FlowRouter.go('/no_matches');
//       }
//     }
//
// };
//
// /**
//  * [filterNoMatches description]
//  * @return {[type]} [description]
//  */
// var filterNoMatches = function() {
//
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     if (ticket) {
//       var match = Matches.findOne({ gameId: ticket.gameId });
//       if (match){
//         FlowRouter.go('/game');
//       }
//     } else if (game.eventFinish > actualMoment) {
//       FlowRouter.go('/event_registration');
//
//     }
//
// };
//
// /**
//  * [filterNoBestMatch description]
//  * @return {[type]} [description]
//  */
// var filterNoBestMatch = function() {
//   if (this.ready()) {
//     var bestMatch = Matches.findOne({ bestMatch: true });
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     if (bestMatch && bestMatch.locationId){
//       FlowRouter.go('/event');
//     }
//     if (ticket) {
//       var game = Games.findOne({ _id: ticket.gameId });
//       if (game){
//         var actualMoment = Session.get('time');
//         if (actualMoment > game.eventFinish){
//           FlowRouter.go('/event_registration');
//
//         }
//       }
//     }
//   }
// };
//
// /**
//  * [filterEventPreferences description]
//  * @return {[type]} [description]
//  */
// var filterEventPreferences = function() {
//   if (this.ready()) {
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     var actualMoment = Session.get('time');
//     if (ticket) {
//       var game = Games.findOne({ _id: ticket.gameId });
//       if (Meteor.userId() && ticket && ticket.status !== 'rejected' && actualMoment > moment(game.gameFinish).add(3, 'minutes')._d && actualMoment < game.eventStart) {
//         //Log.info('User has a ticket and the event has started yet');
//         //If the game is open redirect to game, for testing we redirect to /game
//         FlowRouter.go('/event');
//       }
//       if (ticket && ticket.status === 'rejected') {
//         FlowRouter.go('/rejected_ticket');
//       }
//       if (Meteor.userId() && !ticket) {
//         //Log.info('Something VERY weird happened, going back to event_registration');
//         FlowRouter.go('/event_registration');
//       }
//     }
//   }
// };
//
// /**
//  * [filterEvent description]
//  * @return {[type]} [description]
//  */
// var filterEvent = function() {
//   if (this.ready()) {
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     if (ticket) {
//       var game = Games.findOne({ _id: ticket.gameId });
//       var actualMoment = Session.get('time');
//       // if (Meteor.userId() && ticket && ticket.status==='converted' && game && actualMoment > game.eventStart && actualMoment < game.eventFinish) {
//       //   FlowRouter.go('/event_player_locator');
//       // }
//       if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.gameStart && actualMoment < game.gameFinish) {
//         //Log.info('We should not reach this situation, game is being played at the moment');
//         //If the game is open redirect to game, for testing we redirect to /game
//         FlowRouter.go('/game');
//       }
//       if (ticket && ticket.status === 'rejected') {
//         FlowRouter.go('/rejected_ticket');
//       }
//       var bestMatch = Matches.findOne({ bestMatch: true });
//       if (bestMatch && bestMatch.locationId === null) {
//         FlowRouter.go('/no_best_match');
//       }
//       if (!bestMatch) {
//         FlowRouter.go('/no_best_match');
//       }
//     }
//     if (Meteor.userId() && !ticket){
//       FlowRouter.go('/event_registration');
//     }
//   }
// };
//
// /**
//  * [filterEventPlayerLocator description]
//  * @return {[type]} [description]
//  */
// var filterEventPlayerLocator = function() {
//   if (this.ready()) {
//     var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
//     if (ticket) {
//       var game = Games.findOne({ _id: ticket.gameId });
//       var actualMoment = Session.get('time');
//       if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.gameStart && actualMoment < game.gameFinish) {
//         //Log.info('We should not reach this situation, game is being played at the moment');
//         //If the game is open redirect to game, for testing we redirect to /game
//         FlowRouter.go('/game');
//       }
//       if (ticket && ticket.status === 'rejected') {
//         FlowRouter.go('/rejected_ticket');
//       }
//       var bestMatch = Matches.findOne({ bestMatch: true });
//       if (bestMatch && bestMatch.locationId === null) {
//         FlowRouter.go('/no_best_match');
//       }
//       if (!bestMatch) {
//         FlowRouter.go('/no_best_match');
//       }
//     }
//     if (Meteor.userId() && !ticket){
//         FlowRouter.go('/event_registration');
//     }
//   }
// };
//
//
//   FlowRouter.route('/', {
//     triggersEnter: [goToSessionUrl],
//     action: function () {
//       BlazeLayout.render('home');
//     }
//   });
//   FlowRouter.route('/registration', {
//     triggersEnter: [goToSessionUrl],
//     action: function () {
//       BlazeLayout.render('registration');
//     }
//   });
//   FlowRouter.route('/not_approved', {
//     triggersEnter: [goToSessionUrl],
//     triggersExit: [userProfileComplete],
//     action: function () {
//       BlazeLayout.render('not_approved');
//     }
//   });
//   FlowRouter.route('/rejected_ticket', {
//     triggersEnter: [goToSessionUrl],
//     triggersExit: [userProfileComplete],
//     action: function () {
//       BlazeLayout.render('rejected_ticket', {content: "rejected_ticket"});
//     }
//
//   });
//   FlowRouter.route('/no_matches', {
//     triggersEnter: [goToSessionUrl],
//     triggersExit: [userProfileComplete],
//     action: function () {
//       BlazeLayout.render('no_matches', {content: "no_matches"});
//     }
//   });
//   FlowRouter.route('/profile_me', {
//     triggersEnter: [goToSessionUrl],
//     action: function()
//     {
//       BlazeLayout.render('profile_me', {content: "profile_me"});
//     }
//   });
//
//   FlowRouter.route('/feedback_form', {
//     triggersEnter: [goToSessionUrl],
//     action: function()
//     {
//       BlazeLayout.render('feedback_form', {content: "feedback_form"});
//     }
//   });
//
//   FlowRouter.route('/event_registration', {
//     triggersEnter: [goToSessionUrl],
//     triggersExit: [filterEventRegistration, userProfileComplete],
//     action: function()
//     {
//       BlazeLayout.render('event_registration', {content: "event_registration"});
//     }
//   });
//   FlowRouter.route('/game_waiting', {
//     triggersEnter: [goToSessionUrl],
//   //  triggersExit: [filterGameWaiting, userProfileComplete],
//     action: function()
//     {
//       BlazeLayout.render('game_waiting', {content: "game_waiting"});
//     }
//   });
//   FlowRouter.route('/game', {
//     loadingTemplate: 'loading',
//     layoutTemplate: 'layout',
//     triggersEnter: [userProfileComplete, filterGame],
//     //triggersExit: [filterGame],
//     action: function()
//     {
//       BlazeLayout.render('game', {content: "game"});
//     }
//   });
//   FlowRouter.route('/chat_menu', {
//     triggersEnter: [userApproved],
//     triggersExit: [filterEventPreferences, userProfileComplete],
//     action: function()
//     {
//       BlazeLayout.render('chat_menu', {content: "chat_menu"});
//     }
//   });
//   FlowRouter.route('/no_best_match', {
//     triggersEnter: [goToSessionUrl],
//     triggersExit: [userProfileComplete],
//     action: function () {
//       BlazeLayout.render('no_best_match', {content: "no_best_match"});
//     }
//
//   });
//   FlowRouter.route('/event', {
//     triggersEnter: [userApproved],
//     triggersExit: [userProfileComplete, filterEvent],
//     action: function()
//     {
//       BlazeLayout.render('event', {content: "event"});
//     }
//
//   });
//   FlowRouter.route('/event_player_locator', {
//     triggersEnter: [userProfileComplete],
//     action: function () {
//       BlazeLayout.render('event_player_locator', {content: "event_player_locator"});
//     }
//   });
