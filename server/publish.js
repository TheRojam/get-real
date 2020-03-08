Meteor.publish('userData', function () {
  var self = this;
  var user = Meteor.users.find({_id: self.userId}, {fields: {
    profile: 1,
    username: 1,
    approved: 1,
    context: 1,
    acceptedBeforePrinciples: 1,
    acceptedOnPrinciples: 1,
    acceptedAfterPrinciples: 1,
    seenProcedure: 1,
    availableTickets: 1,
    OTP: 1,
    isMobileVerified: 1,
    SMSsendDate: 1,
    changePassword: 1,
    firstTimeEvent: 1,
    firstTimeChat: 1,
    lastAreaId: 1,
    status_message: 1,
    inviterId: 1
  }});
  return user;
});

Meteor.publish('allNumbers', function () {
  var users = Meteor.users.find({ isMobileVerified: true, fields: { username: 1, isMobileVerified: 1 }});
  return users;
});

Meteor.publish('RedirectUrl', function () {
  var self = this;
  if(!self.userId){
    return [];
  }else{
    var ticket = Meteor.tickets.findOne({ userId: self.userId }, { sort: { createdAt: -1 } });
    var user = Meteor.users.find({_id: self.userId}, {fields: {
      profile: 1,
      username: 1,
      approved: 1,
      context: 1,
      acceptedBeforePrinciples: 1,
      acceptedOnPrinciples: 1,
      acceptedAfterPrinciples: 1
    }});

    return "/profile_me";
  }
});

//GameId for the turns needed
Meteor.publish('Turns', function (language) {
  var self = this;
  // DGB 08.09.2014 For later, when we have users
  //Log.error('Usuario: '+self.userId);
  //Log.error('User language: '+language);
  var condition = {$or: [{activeId: self.userId}, {passiveId: self.userId}]};
  var handle = Turns.find(condition, {sort: {createdAt: 1}}).observeChanges({
    added: function (id, fields) {
      if (fields.activeId === self.userId) {
        fields.active = true;
      } else {
        fields.active = false;
      }
      if (fields.gameCardId) {
        var data = GameCards.findOne({_id: fields.gameCardId});
        fields.question = data.locale[language];
        fields.answerEmbrace = data.answerEmbrace[language];
        fields.answerPositive = data.answerPositive[language];
        fields.answerNegative = data.answerNegative[language];
        fields.answerHate = data.answerHate[language];
        fields.answerAvoid = data.answerAvoid[language];
        if (fields.acceptEmbrace) {
          fields.givenAnswer = data.answerEmbrace[language];
        }
        if (fields.acceptPositive) {
          fields.givenAnswer = data.answerPositive[language];
        }
        if (fields.acceptNegative) {
          fields.givenAnswer = data.answerNegative[language];
        }
        if (fields.acceptHate) {
          fields.givenAnswer = data.answerHate[language];
        }
        if (fields.acceptAvoid) {
          fields.givenAnswer = data.answerAvoid[language];
        }
      }
      self.added('Turns', id, fields);
    },
    changed: function(id, fields) {
      //console.log(fields);
      if (fields.activeId === self.userId) {
        fields.active = true;
      } else {
        fields.active = false;
      }
      if(fields.gameCardId){
        var data = GameCards.findOne({_id: fields.gameCardId});
        fields.question = data.locale[language];
        fields.answerEmbrace = data.answerEmbrace[language];
        fields.answerPositive = data.answerPositive[language];
        fields.answerNegative = data.answerNegative[language];
        fields.answerHate = data.answerHate[language];
        fields.answerAvoid = data.answerAvoid[language];
        if(fields.acceptEmbrace){
          fields.givenAnswer = data.answerEmbrace[language];
        }
        if(fields.acceptPositive){
          fields.givenAnswer = data.answerPositive[language];
        }
        if(fields.acceptNegative){
          fields.givenAnswer = data.answerNegative[language];
        }
        if(fields.acceptHate){
          fields.givenAnswer = data.answerHate[language];
        }
        if(fields.acceptAvoid){
          fields.givenAnswer = data.answerAvoid[language];
        }
      }
      self.changed('Turns', id, fields);
    },
    removed: function (id) {
      self.removed('Turns', id);
    }
  });
  self.ready();
  self.onStop(function() {
    handle.stop();
  });
});

Meteor.publish('GameCards', function (language) {
  var self = this;
  var handle = GameCards.find({}).observeChanges({
    added: function (id, fields){
      var data = GameCards.findOne({_id: id});
      fields.language = data.locale[language];
      fields.answerEmbrace = data.answerEmbrace[language];
      fields.answerPositive = data.answerPositive[language];
      fields.answerNegative = data.answerNegative[language];
      fields.answerHate = data.answerHate[language];
      fields.answerAvoid = data.answerAvoid[language];
      self.added('GameCards', id, fields);
    },
    changed: function (id, fields) {
      var data = GameCards.findOne({_id: id});
      ////Log.info(data);
      fields.language = data.locale[language];
      fields.answerEmbrace = data.answerEmbrace[language];
      fields.answerPositive = data.answerPositive[language];
      fields.answerNegative = data.answerNegative[language];
      fields.answerHate = data.answerHate[language];
      fields.answerAvoid = data.answerAvoid[language];
      self.changed('GameCards', id, fields);
    },
    removed: function (id) {
      self.removed('GameCards', id);
    }
  });
  self.ready();
  self.onStop(function() {
    handle.stop();
  });
});

Meteor.publish('CurrentGame', function () {
  var currentTicket = Tickets.find({userId: this.userId, $or: [ {status: 'bought'}, {status: 'converted'}]}, {sort: {createdAt: -1}, limit: 1});
/*  Log.info(currentTicket.count())*/
  if (currentTicket.count() > 0) {
    var currentGameId = currentTicket.fetch()[0].gameId;
    var gameAreaId = currentTicket.fetch()[0].areaId;
    var currentArea = Areas.find({_id: gameAreaId});
    var currentGame = Games.find({_id: currentGameId, feedbackFinish: {$gte: new Date()}});
    var matchesForCurrentGame = Matches.find({$or: [{playerOneId: this.userId}, {playerTwoId: this.userId}], gameId: currentGameId});
    var otherPlayersId  = _.pluck(matchesForCurrentGame.fetch(), 'playerOneId');
    otherPlayersId = otherPlayersId.concat(_.pluck(matchesForCurrentGame.fetch(), 'playerTwoId'));
    var otherPlayers = Meteor.users.find({_id: {$in: otherPlayersId}});
    var proposalsForCurrentGame = Proposals.find({gameId: currentGameId, selected: false, playerId: this.userId});
    if(currentGame){
      var rankingGame = RankingGames.find({creatorId: this.userId, gameId: currentGameId});
      return [
        currentTicket,
        currentArea,
        currentGame,
        matchesForCurrentGame,
        otherPlayers,
        proposalsForCurrentGame,
        rankingGame
      ];
    }else{
      return [];
    }
  }else{
    return [];
  }
});

// Meteor.publish('CurrentMatch', function () {
//   var currentTicket = Tickets.find({userId: this.userId, $or: [ {status: 'bought'}, {status: 'converted'}]}, {sort: {createdAt: -1}, limit: 1});
//   var currentGameId = currentTicket.fetch()[0].gameId;
//   var currentGame = Games.find({_id: currentGameId, feedbackFinish: {$gte: new Date()}});
//   var matchesForCurrentGame = Matches.find({$or: [{playerOneId: this.userId}, {playerTwoId: this.userId}], gameId: currentGameId});
//   var otherPlayersId  = currentMatch.playerOneId;
//   otherPlayersId = otherPlayersId.concat(currentMatch.playerTwoId);
//   var otherPlayers = Meteor.users.find({_id: {$in: otherPlayersId}});
//   var proposalsForCurrentMatch = Proposals.find({matchId: currentMatch._id, selected: false, playerId: this.userId});
//   if(currentMatch){
//     return [
//       currentTicket,
//       currentGame,
//       matchesForCurrentGame,
//       otherPlayers,
//       proposalsForCurrentMatch
//     ];
//   }else{
//     return [];
//   }
// });

Meteor.publish('CurrentFeedback', function () {
  var self = this;
  var currentTicket = Tickets.find({userId: self.userId, $or: [ {status: 'bought'}, {status: 'converted'}]}, {sort: {createdAt: -1}, limit: 1});
  var currentGameId = currentTicket.fetch()[0].gameId;
  if(currentGameId){
    var feedbacks = Feedbacks.find({userId: this.userId, gameId: currentGameId});
    var  currentFeedback = Feedbacks.findOne({userId: this.userId, gameId: currentGameId}, { sort: { createdAt: -1 } });
    var otherPlayer = Meteor.users.find({_id: currentFeedback.dateId});  // tried to pass name of Date for form_feedback
//     var lastFeedback = currentFeedbacks.fetch()[currentFeedbacks.count()-1];
//
//     var otherPlayer = Meteor.users.findOne({_id: lastFeedback.dateId});  // tried to pass name of Date for form_feedback
    // Log.info("userId: " + this.userId);
    // Log.info("gameId: " + currentGameId);
    // Log.info("currentTicket: " + currentTicket.count());
    // Log.info("currentFeedback: " + currentFeedback.count());
    return [
      currentTicket,
      feedbacks,
      otherPlayer
    ];
  }else{
    Log.info("No feedback found");
  }
});


Meteor.publish('Locations', function () {
  var self = this;
  var handle = Locations.find({}, {sort: {createdAt: -1}}).observeChanges({
    added: function (id, fields){
      self.added('Locations', id, fields);
    },
    changed: function (id, fields) {
      self.changed('Locations', id, fields);
    },
    removed: function (id) {
      self.removed('Locations', id);
    }
  });
  self.ready();
  self.onStop(function() {
    handle.stop();
  });
});

Meteor.publish('EventRegistration', function () {
  var self = this;
  if(!self.userId){
    return [];
  }

  var boughtGames = [];
  // was Tickets before, don't know why or if it works now better
  var tickets = Tickets.find({
    userId: self.userId,
    $or: [{status: 'bought'}, {status: 'converted'}, {status: 'rejected'}]
  });
  if (tickets) {
    tickets.forEach(function(ticket) {
      boughtGames.push(ticket.gameId);
    });
  } else {
    boughtGames = '';
  }
  var adquiredGamesNonExpiredAndAvailableGames = Games.find({
    $or: [
      {
        _id: {$in: boughtGames}, eventFinish: {$gte: new Date()}
      },
      {
        eventFinish: {$gte: new Date()}
      }
    ]
  }, {sort: {gameStart: 1}});
  if (adquiredGamesNonExpiredAndAvailableGames) {
    var areas = Areas.find({status: 'enabled', context: Meteor.users.findOne({_id: self.userId}).context});  // context seems not to be reactive
    return [
      tickets,
      adquiredGamesNonExpiredAndAvailableGames,
      areas
    ];
  } else {
    return [];
  }
});

Meteor.publish('EventBookings', function () {


  var userIds = [];
  var areaIds = [];
  var tickets = Tickets.find({ status: "bought" });
/*  Log.info("tickets: " + tickets.count());*/
  if (tickets) {
    tickets.forEach(function(ticket) {
      userIds.push(ticket.userId);
    });
  } else {
    userIds = '';
  }
  var users = Meteor.users.find({_id: {$in: userIds} });  // needed for gender
/*  Log.info("users: " + users.count());*/
  var games = Games.find({ gameStart: {$gte: new Date() } });
/*  Log.info("games: " + games.count());*/
  if (games) {
    games.forEach(function(game) {
      areaIds.push(game.areaId);
    });
  } else {
    areaIds = '';
  }
/*  Log.info("areaIds: " + areaIds);*/
  var locations = Locations.find({ status: 'enabled', areaId: {$in: areaIds} });  // all locations with their reservations
/*  Log.info("locations: " + locations.count());*/
  if ( locations && tickets && users ) {

    return [
      tickets,
      users,
      games,
      locations
    ];
  } else {
    return [];
  }
});


Meteor.publish('UserContributions', function () {
  var quiestionContribution = userGameCardContributions.find({ creatorId: this.userId });
  var locaitonContribution = userLocationContributions.find({ creatorId: this.userId });
  var areaContribution = userAreaContributions.find({ creatorId: this.userId });
  return [
    quiestionContribution,
    locaitonContribution,
    areaContribution
  ];
});

Meteor.publish('UserInvitations', function () {
  var invitations = userInvitations.find({ userId: this.userId });
  var invitedUserIds  = _.pluck(invitations.fetch(), 'invitedUserId');
  var invitedUsers = Meteor.users.find({_id: {$in: invitedUserIds}});
  return [
    invitations,
    invitedUsers
  ];
});


// works to display date history, but maybe could be more economic when just searching matches with userId in playerOne or playerTwo and bestMatch === true (but feedback must been geiven before)
Meteor.publish('DateHistory', function () {
  var self = this;
  var allTickets = Tickets.find({ userId: self.userId, status: "finished" }, {sort: {createdAt: -1}});
  var gameIds  = _.pluck(allTickets.fetch(), 'gameId');
  var oldGames = Games.find({ _id: {$in: gameIds }}, {sort: {createdAt: -1}});
  var oldMatches = Matches.find({ gameId: {$in: gameIds }, $or: [{playerOneId: this.userId}, {playerTwoId: self.userId}], bestMatch: true }, {sort: {createdAt: -1}});
  var matchIds  = _.pluck(oldMatches.fetch(), '_id');
  var oldTurns = Turns.find({ matchId: {$in: matchIds } });

  var oldDateIds = oldMatches.fetch().map(function (match) {
/*    Log.info("match.playerOneId: " + match.playerOneId);*/
/*    Log.info("this.userId: " + self.userId);*/
    if ( match.playerOneId === self.userId ){
      var user = Meteor.users.findOne({_id: match.playerTwoId});
/*    Log.info("Player 2: " + user.profile.name);*/
    }else{
      var user = Meteor.users.findOne({_id: match.playerOneId});
/*    Log.info("Player 1: " + user.profile.name);*/
    }
/*    Log.info("Found old Date:" + user.profile.name);*/
    return user._id; // I think I couldn't pass the users from the map function or the publish wouldn't send without cursor or so
  });

  var oldDates = Meteor.users.find({_id: {$in: oldDateIds}}); // I think I couldn't pass the users from the map function or the publish wouldn't send without cursor or so
  return [
    allTickets,
    oldGames,
    oldMatches,
    oldTurns,
    oldDates
  ];
});


// Intended to use it in chat_progress_bar, but seems not needed
// Meteor.publish('UsersTurns', function () {
//   // test the code below to reduce data flow
//   // var currentTicket = Tickets.find({userId: this.userId, $or: [ {status: 'bought'}, {status: 'converted'}]}, {sort: {createdAt: -1}, limit: 1});
//   // var currentGameId = currentTicket.fetch()[0].gameId;
//   // var matchesForCurrentGame = Matches.find({$or: [{playerOneId: this.userId}, {playerTwoId: this.userId}], gameId: currentGameId});
//   var condition = {$or: [{activeId: this.userId}, {passiveId: this.userId}]};
//   var usersTurns = Turns.find(condition, {sort: {createdAt: 1}});
//   return usersTurns;
// });
