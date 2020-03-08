Template.game.onCreated(function() {

  // TO DO: are these two following functions really necessary
  if(!Meteor.userId())
  {
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
    return;
  }

  if(!Session.get("selectedMatch"))
  {
    Session.set("userUrl", "/chat_menu");
    FlowRouter.go(Session.get("userUrl"));
    return;
  }

  var self = this;
    self.autorun(function() {
          self.subscribe('CurrentGame');
          self.subscribe('Turns', getUserLanguage());
          self.subscribe('GameCards', getUserLanguage());
    });
});


Template.game.helpers({
  // game: function() {
//     var match = Matches.find({}, { $sort: { position: -1 } });
//     var matches = _.sortBy(match.fetch(), function(match) {
//       return match.position;
//     });
//
//     if (matches.length > 0){
//
//       //End of the Game
//       if(Games.findOne({}) === undefined)
//       {
//         console.log("Game is undefined");
//         Session.set("userUrl", "/event_registration");
//         FlowRouter.go(Session.get("userUrl"));
//       }
//       else {
//           Session.set('gameId', Games.findOne({})._id);
//       }
//
//       //End of the Game
//
//
//       var matchesWithUsers = _.map(matches, function(num) {
//         if (num.playerOneId === Meteor.userId()){
//           num.otherPlayer = Meteor.users.findOne({ _id: num.playerTwoId });
//         }
//         if (num.playerTwoId === Meteor.userId()){
//           num.otherPlayer = Meteor.users.findOne({ _id: num.playerOneId });
//         }
//         //WE NEED A BESTMATCH TRUE
//         if (num){
//           //console.log(num._id._str);
//           Session.setDefault('selectedMatch', num._id._str);
//         }
//         return num;
//       });
//
//
//       //Published turns
//       var turnArray = Turns.find({
//         matchId: Session.get('selectedMatch'),
//         gameId: Games.findOne({})._id
//       });
//       var totalTurns = turnArray.fetch();
//       Session.set('newTurnPublished', totalTurns.length);
//       // console.log("totalTurns: " + totalTurns.length);
//       var userId = Meteor.userId();
//       //Turns variables
//       //Actual turn
//       var actualTurn = totalTurns[totalTurns.length - 1];
//       var actualActiveUser;
//       var actualPassiveUser;
//       if (actualTurn){
//         actualActiveUser = actualTurn.activeId;
//         actualPassiveUser = actualTurn.passiveId;
//       }
//       //Old turns
//       var beforeTurn = totalTurns[totalTurns.length - 2];
//       var givenAnswerBefore;
//       var passiveUserBefore;
//       var activeUserBefore;
//       var activeUserBeforeChoosenAnswerPref;
//       if (beforeTurn){
//         givenAnswerBefore = beforeTurn.givenAnswer;
//         passiveUserBefore = beforeTurn.passiveId;
//         activeUserBefore = beforeTurn.activeId;
//         activeUserBeforeChoosenAnswerPref = beforeTurn.activeUserHasChoosenAnswerPriority;
//       }
//       //The turns to be showed to the user
//       var objectWithActualTurn;
//       var pastTurnsMessages;
//       if (!beforeTurn && actualActiveUser === userId){
//         objectWithActualTurn = actualTurn;
//         pastTurnsMessages = totalTurns;
//       }
//       if (!beforeTurn && actualPassiveUser === userId){
//         objectWithActualTurn = actualTurn;
//         pastTurnsMessages = totalTurns;
//       }
//       if (beforeTurn && givenAnswerBefore && activeUserBefore === userId && givenAnswerBefore){
//         objectWithActualTurn = beforeTurn;
//         pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
//       }
//       if (beforeTurn && givenAnswerBefore && passiveUserBefore === userId &&
//         activeUserBeforeChoosenAnswerPref === true) {
//         objectWithActualTurn = actualTurn;
//         pastTurnsMessages = totalTurns;
//       }
//       if (beforeTurn && givenAnswerBefore && passiveUserBefore === userId &&
//         activeUserBeforeChoosenAnswerPref === false){
//         objectWithActualTurn = beforeTurn;
//         pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
//       }
//       if (beforeTurn && !givenAnswerBefore && passiveUserBefore === userId){
//         objectWithActualTurn = beforeTurn;
//         pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
//       }
//       if (beforeTurn && !givenAnswerBefore && actualPassiveUser === userId &&
//         activeUserBeforeChoosenAnswerPref === true){
//         objectWithActualTurn = actualTurn;
//         pastTurnsMessages = totalTurns;
//       }
//       if (beforeTurn && givenAnswerBefore && actualPassiveUser === userId &&
//         activeUserBeforeChoosenAnswerPref === false){
//         objectWithActualTurn = beforeTurn;
//         pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
//       } else {
//         objectWithActualTurn = actualTurn;
//         pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 1);
//       }
//
//       if ( Matches.findOne({}, { $sort: { position: -1 } }).isFinished === true ){
//         pastTurnsMessages = totalTurns;
//       }
//
//       // console.log("pastTurnsMessages: " + pastTurnsMessages.length);
//
//       // this gamecard selection should select proposals with the current turnId (not blank)
//       var gameCards = [];
//       //skip: Math.floor((Math.random() * 80) + 1)
//       if (objectWithActualTurn){
//         Session.set("setTurnId", objectWithActualTurn._id);
//         var proposals = Proposals.find({
//           selected: false,
//           turnId: { $exists: false },
//           gameId: Games.findOne({})._id,
//           playerId: Meteor.userId(),
//           matchId: Session.get('selectedMatch')
//         }, { limit: 5 });
//         proposals.forEach(function(proposalFind) {
//           gameCards.push(GameCards.findOne({ _id: proposalFind.gameCardId }));
//         });
//       }
//       var summary = {
//         matches: matchesWithUsers,
//         turns: objectWithActualTurn,
//         pastTurns: pastTurnsMessages,
//         gamecards: gameCards
//       };
//       // console.log("pastTurns: " + summary.pastTurns);
//       return summary;
//     }
//     else {
//       Session.set("userUrl", "/");
//       FlowRouter.go(Session.get("userUrl"));
//       // FlowRouter.go('/');
//     }
//   },

  // trying to reduce loading time by only accesing currentMatch
  matchData: function() {
    var match = Matches.findOne({ _id: Session.get('selectedMatch')});
      // console.log("Match: " + match._id)

      Session.set('gameId', match.gameId);

      //Published turns
      var turnArray = Turns.find({
        matchId: Session.get('selectedMatch')
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
      if (!beforeTurn && actualActiveUser === userId){
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      if (!beforeTurn && actualPassiveUser === userId){
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      if (beforeTurn && givenAnswerBefore && activeUserBefore === userId && givenAnswerBefore){
        objectWithActualTurn = beforeTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
      }
      if (beforeTurn && givenAnswerBefore && passiveUserBefore === userId &&
        activeUserBeforeChoosenAnswerPref === true) {
        objectWithActualTurn = actualTurn;
        pastTurnsMessages = totalTurns;
      }
      if (beforeTurn && givenAnswerBefore && passiveUserBefore === userId &&
        activeUserBeforeChoosenAnswerPref === false){
        objectWithActualTurn = beforeTurn;
        pastTurnsMessages = totalTurns.slice(0, totalTurns.length - 2);
      }
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
        // pastTurnsMessages = totalTurns;
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

      // console.log("pastTurnsMessages: " + pastTurnsMessages.length);

      var gameCards = [];
      //skip: Math.floor((Math.random() * 80) + 1)
      if (objectWithActualTurn){
        Session.set("setTurnId", objectWithActualTurn._id);
        var proposals = Proposals.find({
          selected: false,
          turnId: { $exists: false },
          gameId: Games.findOne({})._id,
          playerId: Meteor.userId(),
          matchId: Session.get('selectedMatch')
        }, { limit: 5 });
        proposals.forEach(function(proposalFind) {
          gameCards.push(GameCards.findOne({ _id: proposalFind.gameCardId }));
        });
      }
      var summary = {
        match: match,
        turns: objectWithActualTurn,
        pastTurns: pastTurnsMessages,
        gamecards: gameCards
      };
      // console.log("pastTurns: " + summary.pastTurns);
      return summary;
  },

  // DGB DGB 2015-01-09 03:21 Not high quality, but works
  mustAddSpacingOnHistory: function () {
    return (Session.get("mustAddSpacingOnHistory")===true)?true:false;
  },
  addSpacingOnHistory: function () {
    Session.set("mustAddSpacingOnHistory",true);
  },
  removeSpacingOnHistory: function () {
    Session.set("mustAddSpacingOnHistory",false);
  },
  runTurn: function () {
    if(this && this.turns && this.turns._id){
      Session.set("setTurnId", this.turns._id);
    }
  },
  activeUser: function () {
    if(this && this.turns && this.turns._id){
      if(this.turns.activeId===Meteor.userId()){
        return true;
      }else{
        return false;
      }
    }
  },
  matchUser: function () {
    if(Session.get("selectedMatch")===undefined){
      return false;
    }else{
      return true;
    }
  },
  passiveUser: function () {
    if(this.turns && this.turns._id){
      if(this.turns.passiveId===Meteor.userId()){
        return true;
      }else{
        return false;
      }
    }
  },
  passiveSelectedAnswer: function () {
    if(Session.get("passiveSelectedAnswer")===true){
      return true;
    }else{
      return false;
    }
  },
  establishedQuestionAndPreferedAnswer: function () {
    if(this && this.importance){
      return true;
    }else{
      return false;
    }
  },
  newTurnPublished: function () {
    if(Session.get("newTurnPublished")!==undefined){
      if(this.turns && this.turns._id){
        if(this.turns.activeId===Meteor.userId()){
          Session.set("passiveSelectedAnswer", undefined);
        }
      }
      window.setTimeout(function () {
        var objControl = $("#chat-view");
        objControl.scrollTop = objControl.scrollHeight;
      }, 100);
    }
  },
  countdownClock: function () {
    var gameFinish = Games.findOne();
    // console.log("Gamefinish for countdown: " + gameFinish.gameFinish);
    if(gameFinish){
     return CountdownClock(gameFinish.gameFinish, '/event', 'h');
    }
  },
  gameFinished: function () {
    // var numberTurns = Turns.find({matchId: Session.get('selectedMatch'), gameId: Games.findOne({})._id}).count();
    // if(numberTurns>Games.findOne({}).maxTurns){
    //   return true;
    // }
    var match = Matches.findOne({_id: Session.get('selectedMatch')});
    return match.isFinished
  },
  userMatchEndGame: function () {
    var match = Matches.findOne({_id: Session.get('selectedMatch')});
    if (match.playerOneId === Meteor.userId()) {
      match.otherPlayer = Meteor.users.findOne({_id: match.playerTwoId});
    } else {
      match.otherPlayer = Meteor.users.findOne({_id: match.playerOneId});
    }
    return match;
  },
  selectedPlayer: function(){
    sP = Meteor.users.findOne({ _id: Session.get("idPlayerSelected") });
    return sP;
  },
  blurImage: function(matchId) {
    var turns = Turns.find({ matchId: matchId }).fetch();
    var numberTurns = turns.length;
    var matchFinished = Matches.findOne({ _id: turns[0].matchId }).isFinished;
    var maxTurns = Games.findOne({ _id: turns[0].gameId }).maxTurns;
    if (numberTurns < maxTurns/3){
      return blurImagesOnGame(3);
    }
    if (numberTurns >= maxTurns/3 && numberTurns < maxTurns/1.5){
      return blurImagesOnGame(2);
    }
    if (numberTurns >= maxTurns/1.5 && numberTurns <= maxTurns && !matchFinished){
      return blurImagesOnGame(1);
    }
    if (numberTurns = maxTurns && matchFinished){
      return blurImagesOnGame(0);
    }
  },
  scrollDown: function(matchId) {
    // var objControl = $("#chat-view");
    $("html, body").animate({ scrollTop: $(document).height() }, 500);
  }
});

Template.game.events({
  // should be not in use anymore
  // 'click #profile_me': function (event) {
  //   Session.set("userUrl", "/profile_me");
  //   FlowRouter.go(Session.get("userUrl"));
  // },
  'click #chat_menu': function (event) {
    Session.set("userUrl", "/chat_menu");
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


Template.contribution_form.onRendered(function () {


});
