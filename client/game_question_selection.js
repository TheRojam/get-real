Template.game_question_selection.events({
  'click .option': function (event) {
    Session.set("setAnswer", true);
    Session.set("gameCardId", this);
    var question = event.currentTarget.innerText || event.currentTarget.innerHTML;
    Turns.update({_id: Session.get("setTurnId")}, {$set: {activeUserHasChoosenQuestion: true, gameCardId: this._id, questionChoose: question}});

    //Push
    var turn_select = Turns.findOne({_id: Session.get("setTurnId")});
    var playerName = Meteor.users.findOne({_id: turn_select.activeId}).profile.name;
    // console.log("playername:"+playerName);
    // console.log("passiveId:"+turn_select.passiveId);
    // TO DO add notID to have multiple messages without override on Android
    Meteor.call("userNotification", TAPi18n.__('question_waiting_text', playerName), TAPi18n.__('question_waiting_title', playerName), turn_select.passiveId, 1, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });

    // this selects the Proposals for a turn AFTER selection, should happen before -> move to methods + rails + change games.js
    var sessionMatchId = Session.get('selectedMatch');
    var idProposal = Proposals.findOne({gameCardId: this._id, gameId: Games.findOne({})._id, playerId: Meteor.userId(), matchId: sessionMatchId});
    Proposals.update({_id: idProposal._id}, {$set: {selected: true, turnId: Session.get("setTurnId")}}, function (err, result) {
      if(result){
        var changeProposal = Proposals.find({
          turnId: {$exists: false},
          gameId: Games.findOne({})._id,
          playerId: Meteor.userId(),
          matchId: sessionMatchId
        }, {limit: 4});
        changeProposal.forEach(function (element) {
          //console.log(element);
          Proposals.update({_id: element._id}, {$set: {turnId: Session.get("setTurnId")}});
        });
      }
    });
  }
});
