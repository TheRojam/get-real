Template.chat_progress_bar.onCreated(function() {

  // var self = this;
  //   self.autorun(function() {
  //     self.subscribe('UsersTurns');
  //   });
});


Template.chat_progress_bar.helpers({
  progressBarFields: function(matchId) {

    // var matchId = (matchId) ? matchId : Session.get('selectedMatch');
    var match = Matches.findOne({ _id: matchId });
/*      console.log("Match: "+ matchId);*/
    var turnClasses = [];

    var totalTurns = Turns.find({ matchId: matchId }).fetch();
    var turnCount = totalTurns.length;
    var currentGame = Games.findOne({ _id: match.gameId });
/*      console.log("currentGame: "+ currentGame._id);*/

    totalTurns.forEach(function(turn){
      // hide newest turn to not finished player
/*      console.log(turn.turnNumber +" "+ turnCount);*/
      if ( turn.givenAnswerImportance != "false" && turn.activeUserHasChoosenQuestion && turn.activeUserHasChoosenAnswerPriority === false && turn.turnNumber < turnCount && turn.activeId === Meteor.userId() ) {
        turnCount = turn.turnNumber; // zeigt dem
      };

      if (turn.givenAnswerImportance != "false" && turn.activeUserHasChoosenQuestion && turn.activeUserHasChoosenAnswerPriority) {
        if ( turn.givenAnswerImportance !== "Avoid" ){
          var acceptedAnswer = eval('turn.accept' + turn.givenAnswerImportance);
          // console.log(acceptedAnswer + " : " + turn.givenAnswerImportance);
          var answerClass = ((acceptedAnswer) ? 'green':'red') + ' ' + ((turn.importance === 'high') ? 'darken-1':'accent-2');
        }else{
          var answerClass = "yellow accent-1";
        }
      }else{
        var answerClass = "grey darken-1";
      }
      turnClasses.push(answerClass);
    });

    // has to count from the real count (not the reduced for passivePlayer)
    for (var i=totalTurns.length; i<currentGame.maxTurns; i++) {
      turnClasses.push("grey darken-1");
      // console.log(i);
    }

    var cellWidth = 100 / currentGame.maxTurns;

    if ( match.isFinished ){
      turnCount = -1; // avoid turn number, when done
    }
    // console.log("Match " + matchId + " has " + turnCount + " turns");
    // console.log(turnClasses);

    var tmp = {
      turnClasses: turnClasses,
      turnCount: turnCount,
      cellWidth: cellWidth
    };
    return tmp;
  },

  isTurn: function(id, turnCount) {
    // console.log("TurnCount: " + turnCount + ", index: " + id);
    if ( id + 1 === turnCount ){
      return true;
    }else{
      return false;
    }
  },
});