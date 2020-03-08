Template.game_answer_selection_other_player.events({
  'click #answer-embrace': function (event) {
    //Firefox/Chrome bug 08.03.2015 LFG
    var choosenAnswer = event.currentTarget.innerText || event.currentTarget.innerHTML;
    Turns.update({_id: this._id}, {$set: {givenAnswer: choosenAnswer, givenAnswerImportance: 'Embrace'}});
    Meteor.call('createNewTurn', this.matchId, Session.get('gameId'), this.activeId, this.passiveId);
  },
  'click #answer-positive': function (event) {
    var choosenAnswer = event.currentTarget.innerText || event.currentTarget.innerHTML;
    Turns.update({_id: this._id}, {$set: {givenAnswer: choosenAnswer, givenAnswerImportance: 'Positive'}});
    Meteor.call('createNewTurn', this.matchId, Session.get('gameId'), this.activeId, this.passiveId);
  },
  'click #answer-negative': function (event) {
    var choosenAnswer = event.currentTarget.innerText || event.currentTarget.innerHTML;
    Turns.update({_id: this._id}, {$set: {givenAnswer: choosenAnswer, givenAnswerImportance: 'Negative'}});
    Meteor.call('createNewTurn', this.matchId, Session.get('gameId'), this.activeId, this.passiveId);
  },
  'click #answer-hate': function (event) {
    var choosenAnswer = event.currentTarget.innerText || event.currentTarget.innerHTML;
    Turns.update({_id: this._id}, {$set: {givenAnswer: choosenAnswer, givenAnswerImportance: 'Hate'}});
    Meteor.call('createNewTurn', this.matchId, Session.get('gameId'), this.activeId, this.passiveId);
  },
  'click #answer-avoid': function (event) {
    var choosenAnswer = event.currentTarget.innerText || event.currentTarget.innerHTML;
    Turns.update({_id: this._id}, {$set: {givenAnswer: choosenAnswer, givenAnswerImportance: 'Avoid'}});
    Meteor.call('createNewTurn', this.matchId, Session.get('gameId'), this.activeId, this.passiveId);
  }
});
