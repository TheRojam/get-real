Template.chat_history.onCreated(function() {

  var self = this;
    self.autorun(function() {
          self.subscribe('CurrentGame');
          self.subscribe('DateHistory');
          self.subscribe('Turns', getUserLanguage());
          self.subscribe('GameCards', getUserLanguage());
    });
});


Template.chat_history.helpers({


  // trying to reduce loading time by only accesing currentMatch
  matchData: function() {

    if ( Session.get('selectedMatch') ){
      var match = Matches.findOne({ _id: Session.get('selectedMatch')}); // should come from ate_history
    }else{
      var match = Matches.findOne({ bestMatch: true }); // should come from date_screen
    }
    console.log("Match: " + match._id);

      Session.set('gameId', match.gameId);

      //Published turns
      var turnArray = Turns.find({
        matchId: match._id
      });
      var totalTurns = turnArray.fetch();
      Session.set('newTurnPublished', totalTurns.length);
      // console.log("totalTurns: " + totalTurns.length);
      var userId = Meteor.userId();
      //Turns variables
      //Actual turn
      var actualTurn = totalTurns[totalTurns.length - 1];
      var actualActiveUser;
      var actualPassiveUser;
      if (actualTurn){
        actualActiveUser = actualTurn.activeId;
        actualPassiveUser = actualTurn.passiveId;
      }
      //Old turns
      var beforeTurn = totalTurns[totalTurns.length - 2];
      var givenAnswerBefore;
      var passiveUserBefore;
      var activeUserBefore;
      var activeUserBeforeChoosenAnswerPref;
      if (beforeTurn){
        givenAnswerBefore = beforeTurn.givenAnswer;
        passiveUserBefore = beforeTurn.passiveId;
        activeUserBefore = beforeTurn.activeId;
        activeUserBeforeChoosenAnswerPref = beforeTurn.activeUserHasChoosenAnswerPriority;
      }
      //The turns to be showed to the user
      var objectWithActualTurn;
      var pastTurnsMessages;

      // first turn active user sees all
      if (!beforeTurn && actualActiveUser === userId){
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      // first turn passive user sees all
      if (!beforeTurn && actualPassiveUser === userId){
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      // after first turn passive user sees before turn
      if (beforeTurn && givenAnswerBefore && activeUserBefore === userId && givenAnswerBefore){
        objectWithActualTurn = beforeTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
      }
      // after first turn active user sees all turns if answerAcceptance was set in before turn
      if (beforeTurn && givenAnswerBefore && passiveUserBefore === userId &&
        activeUserBeforeChoosenAnswerPref === true) {
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      // after first turn active user sees before turn if answerAcceptance wasn't set in before turn
      if (beforeTurn && givenAnswerBefore && passiveUserBefore === userId &&
        activeUserBeforeChoosenAnswerPref === false){
        objectWithActualTurn = beforeTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
      }
      // after first turn active user sees before turn if givenAnswerBefore wasn't set
      if (beforeTurn && !givenAnswerBefore && passiveUserBefore === userId){
        objectWithActualTurn = beforeTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
      }

      if (beforeTurn && !givenAnswerBefore && actualPassiveUser === userId &&
        activeUserBeforeChoosenAnswerPref === true){
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      if (beforeTurn && givenAnswerBefore && actualPassiveUser === userId &&
        activeUserBeforeChoosenAnswerPref === false){
        objectWithActualTurn = beforeTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
      } else {
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 1);
      }
      if (actualTurn && actualTurn.givenAnswerImportance !== "false" && actualPassiveUser=== userId ){
        pastTurnsMessages = totalTurns;
        // console.log("triggered");
        // console.log("userId: "+ userId);
        // console.log("actualPassiveUser: "+ actualPassiveUser);
        // console.log("actualTurn.givenAnswer: "+ actualTurn.questionChoose);
        // console.log("actualTurn.givenAnswer: "+ actualTurn.givenAnswerImportance);
        // console.log("actualTurn.givenAnswer: "+ actualTurn.givenAnswer);
      }

      if ( match.isFinished === true ){
        pastTurnsMessages = totalTurns;
      }

      if (match.playerOneId === Meteor.userId()) {
        candidate = Meteor.users.findOne({ _id: match.playerTwoId });
      } else if (match.playerTwoId === Meteor.userId()) {
        candidate = Meteor.users.findOne({ _id: match.playerOneId });
      }

      var summary = {
        match: match,
        candidate: candidate,
        pastTurns: pastTurnsMessages
      };
      // console.log("pastTurns: " + summary.pastTurns);
      return summary;
  }
});

Template.chat_history.events({
  // should be not in use anymore
  // 'click #profile_me': function (event) {
  //   Session.set("userUrl", "/profile_me");
  //   FlowRouter.go(Session.get("userUrl"));
  // },
  'click #back-btn': function (event) {
    Session.set("userUrl", Session.get('backUrl'));
    FlowRouter.go(Session.get("userUrl"));
  }
});

Meteor.Spinner.options = {
  lines: 13, // The number of lines to draw
  length: 10, // The length of each line
  width: 5, // The line thickness
  radius: 15, // The radius of the inner circle
  corners: 0.7, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 30, // The z-index (defaults to 2000000000)
};


Template.chat_history.onRendered(function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});

/*function onBackButtonDown(event) {
  Session.set("userUrl", Session.get('backUrl'));
  FlowRouter.go(Session.get("userUrl"));
}*/