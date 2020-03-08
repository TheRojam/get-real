SyncedCron.add({
  name: 'Checks for match connections',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 5 minutes');
  },
  job: function() {
    // Log.info('Cron success');
    return checkConnections();
  }
});


var checkConnections = function () {
  var openMatches = Matches.find({ bestMatch: true, connected: { $exists: false } }, {sort: {createdAt: -1}});
  Log.info("openMatches:" + openMatches.count());
  openMatches.fetch().map(checkFeedbackConnections);
  return true;
}

var checkFeedbackConnections = function (match) {
  var ticket1 = Tickets.findOne({ gameId: match.gameId, userId: match.playerOneId });
  var feedback1 = Feedbacks.findOne({ gameId: match.gameId, userId: match.playerOneId });
  var ticket2 = Tickets.findOne({ gameId: match.gameId, userId: match.playerTwoId });
  var feedback2 = Feedbacks.findOne({ gameId: match.gameId, userId: match.playerTwoId });
  if ( ticket1 && ticket2 && ticket1.status === "finished" && ticket2.status === "finished" ){
    if ( feedback1.feedback7 === feedback2.feedback7 ){
      Matches.update({ _id: match._id }, { $set: { connected: true }});
      var userName1 = Meteor.users.findOne({_id: match.playerOneId}).profile.name;
      var userName2 = Meteor.users.findOne({_id: match.playerTwoId}).profile.name;
      Meteor.call("userNotification", TAPi18n.__('connected_push_reminder_text', userName2, lang_tag = "de"), TAPi18n.__('connected_push_reminder_title', userName1, lang_tag = "de"), match.playerOneId, 1, function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      });
      Meteor.call("userNotification", TAPi18n.__('connected_push_reminder_text', userName1, lang_tag = "de"), TAPi18n.__('connected_push_reminder_title', userName2, lang_tag = "de"), match.playerTwoId, 1, function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      });
      Log.info("Match: " + match._id + " connected");
    }else{
      Matches.update({ _id: match._id }, { $set: { connected: false }});
      Log.info("Match: " + match._id + " NOT connected");
    }
  }else{
    Log.info("Feedbacks not finished.");
  }
};


// checks for invitations codes to be given.


SyncedCron.add({
  name: 'Checks for invitation code distribution',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 10:00 am');
/*    return parser.text('every 15 seconds');*/
  },
  job: function() {
    // Log.info('Cron success');
    return checkInvitations();
  }
});

var checkInvitations = function () {
  var openFeedbacks = Feedbacks.find({ gotInvite: { $exists: false } }, {sort: {createdAt: -1}}); // this should find both players, so checkFeedbackInvites checks only invitation for the curretn user
  Log.info("openFeedbacks:" + openFeedbacks.count());
  openFeedbacks.fetch().map(checkFeedbackInvites);
  return true;
}

var checkFeedbackInvites = function (feedback) {

/*  Log.info("feedback:" + feedback._id);*/
  var ticket = Tickets.findOne({ gameId: feedback.gameId, userId: feedback.userId });
  var otherTicket = Tickets.findOne({ gameId: feedback.gameId, userId: feedback.dateId });
  var otherFeedback = Feedbacks.findOne({ gameId: feedback.gameId, userId: feedback.dateId });
  if ( ticket.status == "finished" && otherTicket.status == "finished" ){
    if ( otherFeedback.feedback_1 === true && otherFeedback.feedback_3 === true && feedback.feedback_4 === true && otherFeedback.feedback_4 === true && feedback.feedback_6 === true ){
      Feedbacks.update({ _id: feedback._id }, { $set: { gotInvite: true }});
      userInvitations.insert({
        userId: feedback.userId,
        code: Random.hexString(6)
      });
      var userName = Meteor.users.findOne({_id: feedback.userId}).profile.name;
      var otherName = Meteor.users.findOne({_id: feedback.dateId}).profile.name;
      Meteor.call("userNotification", TAPi18n.__('got_invitation_push_reminder_text', otherName, lang_tag = "de"), TAPi18n.__('got_invitation_push_reminder_title', userName, lang_tag = "de"), feedback.userId, 1, function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      });
      Log.info("User " + feedback.userId + " got an invite");
    }else{
      Feedbacks.update({ _id: feedback._id }, { $set: { gotInvite: false }});
/*      Log.info("otherFeedback.feedback1:" + otherFeedback.feedback_1);
      Log.info("otherFeedback.feedback3:" + otherFeedback.feedback_3);
      Log.info("feedback.feedback4:" + feedback.feedback_4);
      Log.info("otherFeedback.feedback4:" + otherFeedback.feedback_4);
      Log.info("feedback.feedback6:" + feedback.feedback_6);*/
      Log.info("Match: " + feedback.userId + " did NOT get an invite");
    }
  }else{
    Log.info("Feedbacks not finished.");
  }
};


// open Game Reminders to buy tickets

SyncedCron.add({
  name: 'Checks for open games',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 10:45 am');
  },
  job: function() {
    // Log.info('Cron success');
    return checkGames();
  }
});


var checkGames = function () {
  var now = new moment().toDate();  // figure out time now
  var openGames = Games.find({gameStart: { $gt: now }, feedbackFinish: { $gt: now } });  // find all open games in the future
  Log.info("openGames:" + openGames.count());
  openGames.fetch().map(sendOpenGameReminders);
  return true;
}

var sendOpenGameReminders = function (game) {

  Log.info("game:" + game._id);
  var area = Areas.findOne({ _id: game.areaId })
  var lastUsers = Meteor.users.find({ lastAreaId: game.areaId });
  Log.info("lastUsers:" + lastUsers.count());
  lastUsers.forEach(function(user) {

    Meteor.call("userNotification", TAPi18n.__('open_game_reminder_text', lang_tag = "de"), TAPi18n.__('open_game_reminder_title', area.name, lang_tag = "de"), user._id, 1, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });

    Log.info(user.profile.name + " got an reminder to join " + game._id + " in " + area.name);
  });

};