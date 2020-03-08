SyncedCron.start();

SyncedCron.add({
  name: 'Send push reminders',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 10 minutes');
  },
  job: function() {
    // Log.info('Cron success');
    return gameReminders();
  }
});


var gameReminders = function () {
  var now = new moment().toDate();  // figure out time now
  Log.info(now);
  var games = Games.find({gameStart: { $lt: now }, feedbackFinish: { $gt: now } });  // find all relevant games
  Log.info("Games:" + games.count());
  // var match = Matches.findOne({_id: matchId});
  // var turns = Turns.find({matchId: matchId, gameId: gameId});
  games.fetch().map(findAllReminders);
  return true;
 }

 var findAllReminders = function (game) {
   var now = new moment().toDate();  // figure out time now
   var later = moment().add(15, 'minutes').toDate()

   // checks if reminder was send already, if matches were created (necessary for chat-games) and if servertime is between chat start and end.
   if ( game.startReminderSend === false && game.matchesCreated === true && game.gameStart <= now && game.gameFinish >= now ) {
     var tickets = Tickets.find({ gameId: game._id });
     Log.info("Tickets:" + tickets.count());
     tickets.fetch().map(sendStartReminders);
     Games.update({_id: game._id}, {$set: {startReminderSend: true}});
     Log.info("Game " + game._id + " startReminderSend: true");
   }

   // checks if user has been non-activ and last reminder has been at least 30 minutes ago.
   if ( game.gameStart <= now && game.gameFinish >= now ) {
     turns = Turns.find({ gameId: game._id })
     Log.info("Turns:" + turns.count());
     turns.fetch().map(sendGameReminders);
     Log.info("Game " + game._id + " has checked for gameReminderSend");
   }

   // checks if reminder was send already and if servertime is 15 minutes before the chat-game ends.
   if ( game.endReminderSend === false && game.gameStart <= now && game.gameFinish <= later ) {
     var tickets = Tickets.find({ gameId: game._id, status: "converted" });
     Log.info("Tickets:" + tickets.count());
     tickets.fetch().map(sendEndReminders);
     Games.update({_id: game._id}, {$set: {endReminderSend: true}});
     Log.info("Game " + game._id + " endReminderSend: true");
   }

   // checks if reminder was send already and if servertime is after the chat-game ends and before the date started.
   if ( game.goDateReminderSend === false && game.datesCreated === true && game.gameFinish <= now && game.eventStart >= now ) {
     var tickets = Tickets.find({ gameId: game._id, status: "converted" });
     Log.info("Tickets:" + tickets.count());
     tickets.fetch().map(sendGoDateReminders);
     Games.update({_id: game._id}, {$set: {goDateReminderSend: true}});
     Log.info("Game " + game._id + " goDateReminderSend: true");
   }

   // checks if reminder was send already and if servertime is at the start of the date.
   if ( game.dateStartReminderSend === false && game.datesCreated === true && game.gameFinish <= now && game.eventStart <= now ) {
     var tickets = Tickets.find({ gameId: game._id, status: "converted" });
     Log.info("Tickets:" + tickets.count());
     tickets.fetch().map(sendDateStartReminders);
     Games.update({_id: game._id}, {$set: {dateStartReminderSend: true}});
     Log.info("Game " + game._id + " dateEndReminderSend: true");
   }

   // checks if reminder was send already and if servertime is after the date ends.
   if ( game.dateEndReminderSend === false && game.datesCreated === true && game.gameFinish <= now && game.eventFinish <= now ) {
     var tickets = Tickets.find({ gameId: game._id, status: "converted" });
     Log.info("Tickets:" + tickets.count());
     tickets.fetch().map(sendDateEndReminders);
     Games.update({_id: game._id}, {$set: {dateEndReminderSend: true}});
     Log.info("Game " + game._id + " dateEndReminderSend: true");
   }

   // checks if reminder was send already and if servertime is some time after date ended.
   if ( game.feedbackReminderSend === false && game.datesCreated === true && game.feedbackStart <= now ) {
     var tickets = Tickets.find({ gameId: game._id, status: "converted"  });  // user that already gave feedback won't be pushed
     Log.info("Tickets:" + tickets.count());
     tickets.fetch().map(sendFeedbackReminders);
     Games.update({_id: game._id}, {$set: {feedbackReminderSend: true}});
     Log.info("Game " + game._id + " feedbackReminderSend: true");
   }

   return true
  }
// sends the push notifications

var sendStartReminders = function (ticket) {
  var userName = Meteor.users.findOne({_id: ticket.userId}).profile.name;
  Meteor.call("userNotification", TAPi18n.__('start_game_push_reminder_text', lang_tag = "de"), TAPi18n.__('start_game_push_reminder_title', userName, lang_tag = "de"), ticket.userId, 1, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  Log.info("StartReminder pushed to " + userName);
  return true
}

var sendGameReminders = function (turn) {
  // truing to send a reminder push 1h from the last interaction, could be the last updated turn or the users last send reminder in the DB

  // Log.info("-----------------—-----------------—-----------------—-----------------—-----------------—");
  // Log.info("turn.id : " + (turn._id));
  if ( turn.updatedAt === undefined ){
    turn.updatedAt = turn.createdAt; // necessary for new turns
  }
  var reminderTimer = moment().subtract(1, 'hour').toDate();

  // sends reminder to active player
  var oldReminders = GameReminders.find({ gameId: turn.gameId, userId: turn.activeId }).fetch();

  // Log.info("oldReminders for active:" + oldReminders.length);

  if ( oldReminders[oldReminders.length - 1] ){
    var lastReminder = oldReminders[oldReminders.length - 1].sendTime;
  }else{
    var lastReminder = turn.updatedAt;
  }
  // Log.info("will send active push : " + ( (turn.activeUserHasChoosenQuestion === false || turn.activeUserHasChoosenAnswerPriority === false) && lastReminder <= reminderTimer ));
  // Log.info("turn.updatedAt : " + (turn.updatedAt));
  // Log.info("lastReminder : " + (lastReminder));
  // Log.info("reminderTimer : " + (reminderTimer));

  if ( (turn.activeUserHasChoosenQuestion === false || turn.activeUserHasChoosenAnswerPriority === false) && lastReminder <= reminderTimer ){
    var userName = Meteor.users.findOne({ _id: turn.activeId }).profile.name;
    var otherName = Meteor.users.findOne({ _id: turn.passiveId }).profile.name;
    Meteor.call("userNotification", TAPi18n.__('active_game_push_reminder_text', otherName, lang_tag = "de"), TAPi18n.__('active_game_push_reminder_title', otherName, lang_tag = "de"), turn.activeId, 1, function (err, result) {
      if (err) {
        Log.alert(err);
      }
      Log.info(result);
      Log.info("active gameReminder pushed to " + userName);
      GameReminders.insert({ userId: turn.activeId, sendTime: Date.now(), turnId: turn._id, matchId: turn.matchId, gameId: turn.gameId });
    });
  }

  // sends reminder to passive player
  var oldReminders = GameReminders.find({ gameId: turn.gameId, userId: turn.passiveId }).fetch();

  // Log.info("oldReminders for passive:" + oldReminders.length);
  if ( oldReminders[oldReminders.length - 1] ){
    var lastReminder = oldReminders[oldReminders.length - 1].sendTime;
  }else{
    var lastReminder = turn.updatedAt;
  }
  // Log.info("will send passive push : " + ( turn.activeUserHasChoosenQuestion === true && turn.givenAnswerImportance === "false" && lastReminder <= reminderTimer ));
  // Log.info("turn.updatedAt : " + (turn.updatedAt));
  // Log.info("lastReminder : " + (lastReminder));
  // Log.info("reminderTimer : " + (reminderTimer));
  if ( turn.activeUserHasChoosenQuestion === true && turn.givenAnswerImportance === "false" && lastReminder <= reminderTimer ){
    var userName = Meteor.users.findOne({ _id: turn.passiveId }).profile.name;
    var otherName = Meteor.users.findOne({ _id: turn.activeId }).profile.name;
    Meteor.call("userNotification", TAPi18n.__('passive_game_push_reminder_text', otherName, lang_tag = "de"), TAPi18n.__('passive_game_push_reminder_title', otherName, lang_tag = "de"), turn.passiveId, 1, function (err, result) {
      if (err) {
        Log.alert(err);
      }
      Log.info(result);
      Log.info("passive gameReminder pushed to " + userName);
      GameReminders.insert({ userId: turn.passiveId, sendTime: Date.now(), turnId: turn._id, matchId: turn.matchId, gameId: turn.gameId });
    });
  }

  return true
}

var sendEndReminders = function (ticket) {
  var userName = Meteor.users.findOne({_id: ticket.userId}).profile.name;
  Meteor.call("userNotification", TAPi18n.__('almost_end_game_push_reminder_text', lang_tag = "de"), TAPi18n.__('almost_end_game_push_reminder_title', userName, lang_tag = "de"), ticket.userId, 1, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  Log.info("endReminder pushed to " + userName);
  return true
}

var sendGoDateReminders = function (ticket) {
  // var userName = Meteor.users.findOne({_id: ticket.userId}).profile.name;
  Meteor.call("userNotification", TAPi18n.__('go_date_push_reminder_text', lang_tag = "de"), TAPi18n.__('go_date_push_reminder_title', lang_tag = "de"), ticket.userId, 1, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  Log.info("goDateReminder pushed to " + ticket.userId);
  return true
}

var sendDateStartReminders = function (ticket) {
  var userName = Meteor.users.findOne({_id: ticket.userId}).profile.name;
  Meteor.call("userNotification", TAPi18n.__('date_start_push_reminder_text', lang_tag = "de"), TAPi18n.__('date_start_push_reminder_title', userName, lang_tag = "de"), ticket.userId, 1, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  Log.info("dateStartReminder pushed to " + userName);
  return true
}

var sendDateEndReminders = function (ticket) {
  var userName = Meteor.users.findOne({_id: ticket.userId}).profile.name;
  Meteor.call("userNotification", TAPi18n.__('date_end_push_reminder_text', lang_tag = "de"), TAPi18n.__('date_end_push_reminder_title', userName, lang_tag = "de"), ticket.userId, 1, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  Log.info("dateEndReminder pushed to " + userName);
  return true
}

var sendFeedbackReminders = function (ticket) {
  // var userName = Meteor.users.findOne({_id: ticket.userId}).profile.name;
  Meteor.call("userNotification", TAPi18n.__('feedback_push_reminder_text', lang_tag = "de"), TAPi18n.__('feedback_push_reminder_title', lang_tag = "de"), ticket.userId, 1, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  Log.info("feedbackReminder pushed to " + ticket.userId);
  return true
}