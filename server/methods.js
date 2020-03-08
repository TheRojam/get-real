Meteor.methods({
  /**
   * [createNewTurn function that creates a new turn for the game]
   * @param  {[type]} matchId   [description]
   * @param  {[type]} gameId    [description]
   * @param  {[type]} activeId  [description]
   * @param  {[type]} passiveId [description]
   * @return {[type]}           [description]
   */
  createNewTurn: function (matchId, gameId, activeId, passiveId) {
    // To Do add if to check for finished Game
    var game = Games.findOne({_id: gameId});
    var match = Matches.findOne({_id: matchId});
    var turns = Turns.find({matchId: matchId, gameId: gameId});

    if (turns.count() < game.maxTurns){
      // Log.info('turns: '+ turns.count());
      Turns.insert({
        matchId: matchId,
        gameId: gameId,
        activeId: passiveId,
        passiveId: activeId,
        activeUserHasChoosenQuestion: false,
        activeUserHasChoosenAnswerPriority: false,
        turnNumber: turns.count() + 1,
        givenAnswer: "false",
        givenAnswerImportance: "false"
      });
    }else{
      // sends push to match players
      Meteor.call("finishMatch", gameId, matchId);
    }

  },
  /**
   * [createNewTurn function that creates a new turn for the game]
   * @param  {[type]} matchId   [description]
   * @param  {[type]} gameId    [description]
   * @param  {[type]} activeId  [description]
   * @param  {[type]} passiveId [description]
   * @return {[type]}           [description]
   */
  finishMatch: function (gameId, matchId) {
    // To Do add if to check for finished Game
    // var match = Matches.findOne({ _id: matchId });
    var game = Games.findOne({_id: gameId});
    var turns = Turns.find({matchId: matchId, gameId: gameId});
    if ( turns.count() === game.maxTurns && turns && turns.fetch()[game.maxTurns - 1] && turns.fetch()[game.maxTurns - 1].activeUserHasChoosenAnswerPriority === true && turns.fetch()[game.maxTurns - 1].givenAnswerImportance !== "false" ){
      Log.info('Match ' + matchId + ' is finsihed');
      Matches.update({_id: matchId}, {$set: {isFinished: true}});
      // sends push to match players
      var userName = Meteor.users.findOne({ _id: match.playerTwoId }).profile.name;
      Meteor.call("userNotification", TAPi18n.__('match_finished_text'), TAPi18n.__('match_finished_title', userName), match.playerOneId, 1, function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      });
      var userName = Meteor.users.findOne({ _id: match.playerOneId }).profile.name;
      Meteor.call("userNotification", TAPi18n.__('match_finished_text'), TAPi18n.__('match_finished_title', userName), match.playerTwoId, 1, function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      })
    }
  },
  // /**
 //   * [createNewFeedback function that creates a new feedback after the game]
 //   */
 //  createNewFeedback: function (gameId, userId, dateId, locationId, feedback_1, feedback_2, feedback_3, feedback_4, feedback_5, feedback_6, feedback_7) {
 //    // To Do add if to check for finished Game
 //    if (Feedbacks.findOne({gameId: gameId, userId: userId}) === undefined) {
 //      var insertion =     Feedbacks.insert({
 //      gameId: gameId,
 //      locationId: locationId,
 //      userId: userId,
 //      dateId: dateId
 //    });
 //      Log.info('Inserted Feedback: '+insertion);
 //      return insertion;
 //    } else {
 //      Log.error('Already a Feedback on the database');
 //      return null;
 //    }
 //    // Feedbacks.insert({
 //    //   gameId: gameId,
 //    //   locationId: locationId,
 //    //   userId: userId,
 //    //   dateId: dateId,
 //    //   feedback_1: feedback_1,
 //    //   feedback_2: feedback_2,
 //    //   feedback_3: feedback_3,
 //    //   feedback_4: feedback_4,
 //    //   feedback_5: feedback_5,
 //    //   feedback_6: feedback_6,
 //    //   feedback_7: feedback_7
 //    // });
 //  },

  /**
   * [addUserToGame description]
   * @param {[type]} userId
   * @param {[type]} gameId
   */
  addUserToGame: function (userId, gameId, areaId) {
    if (Tickets.findOne({gameId: gameId, userId: userId, status: 'bought', areaId: areaId}) === undefined) {
      if (Tickets.findOne({gameId: gameId, userId: userId, status: 'returned', areaId: areaId}) === undefined) {
        var insertion = Tickets.insert({gameId: gameId, userId: userId, status: 'bought', areaId: areaId, matchingpointsCreated: false});
        updateUser = Meteor.users.update({ _id: userId }, { $set: { "lastAreaId": areaId }});
        Log.info('Inserted ticket: '+ insertion + " + udated lastArea to: " + areaId );
        return insertion;
      }else{
        var update = Tickets.update({ gameId: gameId, userId: userId, status: 'returned', areaId: areaId },  {$set: {status: "bought" }});
        Log.info('Updated ticket: '+ update);
        return update;
      }
    } else {
      Log.error('Already a ticket on the database');
      return null;
    }
  },
  /**
   * [getServerTime description]
   * @return {[type]} [description]
   */
  getServerTime: function () {
    var time = new Date();
    //console.log(time);
    return time;
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Method that checks to where the user should be reidrected.
  // this method should only be necessary, if the user broke his current position (e.g. back button)

  getUserUrl: function (userId) {
    Log.info("Checking for the correct route - setNewUserUrl");

    // check if user is verfified -> SMS_verification screen
    if (Meteor.user() && Meteor.user().isMobileVerified !== true){
      Log.info("User is not verified by SMS yet");
      return ("/SMS_verification");
    }

    // check if user is blocked -> profile screen
    if (Meteor.user() && Meteor.user().approved !== true && Meteor.user().approvalRequested === "blocked"){
      Log.info("User is blocked by admins and needs to work on profile");
      return ("/profile_me");
    }

    // check if user is approved -> not_approved screen
    if (Meteor.user() && Meteor.user().approved !== true){
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photo && Meteor.user().profile.photoName && Meteor.user().profile.birthYear && Meteor.user().profile.genderWanted && Meteor.user().profile.language && Meteor.user().profile.gender && Meteor.user().profile.name && (Meteor.user().profile.youngerWanted === true || Meteor.user().profile.sameWanted === true || Meteor.user().profile.olderWanted === true ) && Meteor.user().acceptedBeforePrinciples === true && Meteor.user().acceptedOnPrinciples === true && Meteor.user().acceptedAfterPrinciples === true && Meteor.user().context == "normal" ){
          Log.info("User is not approved by admins yet");
          return ("/not_approved");
      }
    }

    // check if process was seen
    if ( Meteor.user() && Meteor.user().seenProcedure !== true ) {
      Log.info("User needs to see procedure");
      return ("/procedure");
    }

    // check if principles accepted
    if ( Meteor.user() && ( Meteor.user().acceptedBeforePrinciples === false || Meteor.user().acceptedOnPrinciples === false || Meteor.user().acceptedAfterPrinciples === false )) {
      Log.info("User needs to accept principles");
      return ("/principles");
    }

    // check if profile is complete
    if ( Meteor.user() && Meteor.user().profile && Meteor.user().profile.photoName && Meteor.user().profile.birthYear && Meteor.user().profile.genderWanted && Meteor.user().profile.language && Meteor.user().profile.gender && Meteor.user().profile.name && (Meteor.user().profile.youngerWanted === true || Meteor.user().profile.sameWanted === true || Meteor.user().profile.olderWanted === true ) && Meteor.user().acceptedBeforePrinciples === true && Meteor.user().acceptedOnPrinciples === true && Meteor.user().acceptedAfterPrinciples === true) {
    }else{
      Log.info("Profile incomplete");
      return ("/profile_me");
    }

    // check if tickets are available and its status
    var ticket = Tickets.findOne({userId: userId}, { sort: { updatedAt: -1 } });
    // Tickets.findOne({gameId: gameId, userId: userId, status: 'bought', areaId: areaId}) === undefined)

    // var actualMoment = Session.get('time');
    var actualMoment = new Date();
    Log.info("Servertime: " + actualMoment);

    if (ticket){
      Log.info("Ticket: " + ticket.userId);
      var game = Games.findOne({ _id: ticket.gameId });
      Log.info("Event-Starts: " + game.eventStart);
      Log.info("Event-Finish: " + game.eventFinish);

      // check if user's ticket has been rejected -> go to game_waiting
      if (ticket && ticket.status === 'rejected'){
        return ("/rejected_ticket");
      }

      // check if user's game is already finished
      if (Meteor.userId() && ticket && ticket.status === 'finished' && game && actualMoment > game.feedbackFinish){
        Log.info("Ticket is finished!");
        return ("/event_registration");
      }

      // check if user's game is in feedback mode -> feedback form
      if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.feedbackStart){
        // NEED TO ADD check if feedback has been given (should be status finished!) AND use ticket status better (more detail)
        return ("/feedback_form");
      }

      //////////////////////////////////////////////////////////////////////////////
      // STARTED a screen for ON Date with icebreaker gamecards and panic button
      //////////////////////////////////////////////////////////////////////////////

      // check if user's game is during date -> feedback form
      if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.eventFinish){
        // NEED TO ADD check if feedback has been given AND use ticket status better (more detail)
        return ("/date_screen");
      }

      // check if user's game is in the date -> find candiDate
      // TO DO add check bestMatch functionality, more accurate
      if (Meteor.userId() && ticket && ticket.status === 'converted' && game && game.datesCreated === true && actualMoment > game.eventStart && actualMoment < game.eventFinish){
        return ("/event_player_locator");

      }

      // check if user's game is between the 4play and the date -> find location
      // TO DO add check bestMatch functionality, more accurate
      if (Meteor.userId() && ticket && ticket.status === 'converted' && game && actualMoment > game.gameFinish && actualMoment < game.eventStart) {
        Log.info("Event:");
        Log.info("Servertime: " + actualMoment);
        Log.info("Game start: " + game.gameStart);
        Log.info("Game finish: " + game.gameFinish);
        return ("/event");
      }

      // check if user is in 4play (game) -> go to game
      if (Meteor.userId() && ticket && ticket.status === 'converted' && ticket.matchingpointsCreated === true && game && actualMoment > game.gameStart && actualMoment < game.gameFinish) {
        Log.info("Game:");
        Log.info("Servertime: " + actualMoment);
        Log.info("Game start: " + game.gameStart);
        Log.info("Game finish: " + game.gameFinish);
        return ("/chat_game");
      }

      // check if user is before 4play (game) with a ticket -> go to game_waiting
      // can be converted 1 min before start and still needs to be redirected to game_waiting
      var ticketStatus = (ticket && (ticket.status === 'bought' || ticket.status === 'converted')) ? true:false;
      if (ticket && ticketStatus === true && game && (actualMoment < game.gameStart)) {
        Log.info("/game_waiting");
        return ("/game_waiting");

      }

      Log.info("No URL filter -> event registration");
      return ("/event_registration")

    } else {
        // no ticket -> event registration
        Log.info("No ticket -> event registration");
        return ("/event_registration");

    }
  },

   /**
   * [addQuestionContribution description]
   * @param {[type]} userId
   * @param {[type]} questionContribution
   * @param {[type]} embraceContribution
   * @param {[type]} positiveContribution
   * @param {[type]} negativeContribution
   * @param {[type]} hateContribution
   * @param {[type]} avoidContribution
   * @param {[type]} noteContribution
   * @param {[type]} userLanguage

   */
  addQuestionContribution: function (userId, questionContribution, embraceContribution, positiveContribution, negativeContribution, hateContribution, avoidContribution, noteContribution, userLanguage) {
    if (userGameCardContributions.findOne({creatorId: userId, question: questionContribution, answerEmbrace: embraceContribution, answerPositive: positiveContribution, answerNegative: negativeContribution, answerHate: hateContribution, answerAvoid: avoidContribution, note: noteContribution, language: userLanguage}) === undefined) {
      var insertion = userGameCardContributions.insert({ creatorId: userId, question: questionContribution, answerEmbrace: embraceContribution, answerPositive: positiveContribution, answerNegative: negativeContribution, answerHate: hateContribution, answerAvoid: avoidContribution, note: noteContribution, language: userLanguage, status: "new_contribution" });
      Log.info('Inserted User Question contribution: '+ insertion);
      return insertion;
    } else {
      Log.error('Already a same Question contribution on the database');
      return null;
    }
  },

   /**
   * [addLocationContribution description]
   * @param {[type]} userId
   * @param {[type]} locationName
   * @param {[type]} city
   * @param {[type]} search
   * @param {[type]} note
   * @param {[type]} userLanguage

   */
  addLocationContribution: function (userId, locationName, city, search, note, userLanguage) {
    if (userLocationContributions.findOne({ creatorId: userId, name: locationName, city: city, search: search, note: note, language: userLanguage }) === undefined) {
      var insertion = userLocationContributions.insert({ creatorId: userId, name: locationName, city: city, search: search, note: note, language: userLanguage, status: "new_contribution" });
      Log.info('Inserted User Location contribution: '+ insertion);
      return insertion;
    } else {
      Log.error('Already a same Location contribution on the database');
      return null;
    }
  },

   /**
   * [addAreaContribution description]
   * @param {[type]} userId
   * @param {[type]} areaName
   * @param {[type]} country
   * @param {[type]} userLanguage

   */
  addAreaContribution: function (userId, areaName, country, userLanguage) {
    if (userAreaContributions.findOne({ creatorId: userId, name: areaName, country: country, language: userLanguage }) === undefined) {
      var insertion = userAreaContributions.insert({ creatorId: userId, name: areaName, country: country, language: userLanguage, status: "new_contribution" });
      Log.info('Inserted User Area contribution: '+ insertion);
      return insertion;
    } else {
      Log.error('Already a same Area contribution on the database');
      return null;
    }
  },

   /**
   * [redeemInvitationCode description]
   * @param {[type]} invitedId
   * @param {[type]} invitationCode

   */
  redeemInvitationCode: function (invitedId, invitationCode) {

    var used_invitation = userInvitations.findOne({ code: invitationCode, invitedUserId: invitedId });

    if ( used_invitation === undefined ){
      var invitation = userInvitations.findOne({ code: invitationCode, invitedUserId: { "$exists" : false } });

      if ( invitation && invitation.invitedUserId === undefined && invitedId !== invitation.userId ) {
        if (userInvitations.update({ _id: invitation._id},  {$set: {invitedUserId: invitedId, invitationAccepted: Date.now()}})) {
          Log.info('Redeemed Invitation: ' + invitationCode);
          Meteor.users.update( { _id: Meteor.userId() },  {$set: {approved: true, approval_by: "invitation", inviterId: invitation.userId}});
          return true;
        }else{
          return false;
        }
      } else {
        Log.error('Invitation code has been used already or is wrong');
        return false;
      }
    }
    return false;
  },

  setUserAcceptance: function (acceptedPrinciples) {

    if ( acceptedPrinciples === "acceptedBeforePrinciples" ){
      update = Meteor.users.update({ _id: Meteor.userId() }, { $set: { "acceptedBeforePrinciples": true }});
    }
    if ( acceptedPrinciples === "acceptedOnPrinciples" ){
      update = Meteor.users.update({ _id: Meteor.userId() }, { $set: { "acceptedOnPrinciples": true }});
    }
    if ( acceptedPrinciples === "acceptedAfterPrinciples" ){
      update = Meteor.users.update({ _id: Meteor.userId() }, { $set: { "acceptedAfterPrinciples": true }});
    }

    if (update) {
      Log.info(acceptedPrinciples + ' were accepted by: ' + Meteor.userId());
      return true;
    } else {
      Log.error(acceptedPrinciples + ' could not be accepted by: ' + Meteor.userId());
      return false;
    };
  },

  deleteTicket: function (ticketId, userId) {

    update = Tickets.update({ _id: ticketId, userId: userId }, { $set: { status: "returned" }});

    if (update) {
      Log.info(ticketId + ' was returned by ' + userId);
      return true;
    } else {
      Log.info(ticketId + ' was tried to be returned by ' + userId);
      return false;
    };
  },

  sendCodeSMS: function (code, mobile) {
    // call twilio API
    HTTP.call(
      'POST',
      'https://api.twilio.com/2010-04-01/Accounts/' +
      'AC781855d65d7d4e85f49a01a5a24d275c' + '/SMS/Messages.json', {
        params: {
          From: '+4915735999191',
          To: mobile,
          Body: TAPi18n.__('SMS_code_text', code),
        },
        auth: 'AC781855d65d7d4e85f49a01a5a24d275c' + ':' + '72cebddc297c9371437bd019655804cf'
      }, function (error) {
        if (error) {
          return console.log('API request failed.');
        }

        Meteor.users.update({ username: mobile }, {$set: { 'SMSsendDate': new moment().toDate() } });
        Log.info('Code SMS sent successfully to ' + mobile);
      });
  },

  verifySMS: function (userId, code) {
    const user = Meteor.users.findOne({ _id: userId });

    if(!user.OTP || user.OTP !== code) {
      Log.info('Invalid OTP.');
      return false;
    }
    return Meteor.users.update({ _id: userId }, {
      $set: { 'isMobileVerified': true },
      $unset: { 'OTP': 0 },
    });
  },

  resetPasswordUrl: function (mobile) {
    const user = Meteor.users.findOne({ username: mobile });
/*    Log.info('user: ' + user);*/
    var token = Random.secret();
/*    Log.info('token: ' + token);*/
    var when = new Date();
    var tokenRecord = {
      token: token,
      email: mobile,
      when: when,
      reason: 'reset'
    };
    Meteor.users.update(user._id, {$set: { "services.password.reset": tokenRecord }});

    var resetPasswordUrl = Accounts.urls.resetPassword(token);
/*    Log.info('resetPasswordUrl: ' + resetPasswordUrl);*/
    return resetPasswordUrl;
  },

  sendSMS: function (text, mobile) {
    // call twilio API
    HTTP.call(
      'POST',
      'https://api.twilio.com/2010-04-01/Accounts/' +
      'AC781855d65d7d4e85f49a01a5a24d275c' + '/SMS/Messages.json', {
        params: {
          From: '+4915735999191',
          To: mobile,
          Body: text,
        },
        auth: 'AC781855d65d7d4e85f49a01a5a24d275c' + ':' + '72cebddc297c9371437bd019655804cf'
      }, function (error) {
        if (error) {
          return console.log('API request failed.');
        }

        Log.info('Text SMS sent successfully to ' + mobile);
      });
  },

  sendResetSMS: function (mobile, username, birthyear) {
    const user = Meteor.users.findOne({ username: mobile });
/*    Log.info('user: ' + user);*/
    // checks if the data matches
    if ( user.profile.name === username && user.profile.birthYear === birthyear ){

      var earlier = moment().subtract(15, 'minutes').toDate()
      // checks if SMS was already send in the last 15 min (save costs)
      if ( user.changePassword && user.changePassword <= earlier ){


      // working method of sending reset URL -> no clickable URL + User gets send to Browser... need inAPP solution
       /* var token = Random.secret();
        var when = new Date();
        var tokenRecord = {
          token: token,
          email: mobile,
          when: when,
          reason: 'reset'
        };
        Meteor.users.update(user._id, {$set: { "services.password.reset": tokenRecord }});

        var resetPasswordUrl = Accounts.urls.resetPassword(token);*/

        var new_password = Random.secret(5);
        Accounts.setPassword( user._id, new_password );
        Meteor.users.update( user._id, {$set: { "changePassword": moment().toDate() }} );

        Meteor.call('sendSMS', TAPi18n.__('new_pswd_sms_text', new_password, lang_tag = "de"), mobile, (error) => {
          if(error) {
            return console.log(error);
          }else{
            return "send";
          }
        });
      }else{
        return "tooEarly";
      }

    }else{
      return "noMatch";
    }



  },

  checkUserNumber: function (mobile) {
    const user = Meteor.users.findOne({ username: mobile, isMobileVerified: true });
    if ( user && user.username ){
      return true;
    }else{
      return false;
    }
  },

  addIUserInvitation: function (mobile) {
    const user = Meteor.users.findOne({ username: mobile });
    if ( user && user._id ){
      // Adds invitation code
      return userInvitations.insert({
        userId: user._id,
        code: Random.hexString(6)
      });
    }else{
      return false;
    }
  }

});
