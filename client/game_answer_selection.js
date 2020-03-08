Session.set('setPriorityAnswer', undefined);
Template.game_answer_selection.helpers({
  // TO DO change names to embraceAccepted or so
  setBackgroundEmbrace: function () {
    if(this.acceptEmbrace===true){
      return true;
    }
  },
  setBackgroundPositive: function () {
    if(this.acceptPositive===true){
      return true;
    }
  },
  setBackgroundNegative: function () {
    if(this.acceptNegative===true){
      return true;
    }
  },
  setBackgroundHate: function () {
    if(this.acceptHate===true){
      return true;
    }
  },
  setBackgroundAvoid: function () {
    if(this.acceptAvoid===true){
      return true;
    }
  },
// SEEMS UNNECESSARY if this. works in .html template
  // establishPossibleAnswers: function () {
  //   if(Session.get("gameCardId")!==undefined){
  //     return Session.get("gameCardId");
  //   }
  // },
  disableButtons: function () {
    if(this.acceptEmbrace===true || this.acceptPositive===true || this.acceptNegative===true || this.acceptHate===true || this.acceptAvoid===true){
      // Session.set('setPriorityAnswer', true);
      // $('#prio-buttons').slideDown();
/*      $("#prio-buttons button").removeClass('disabled');*/
      return false;
    }else{
      // Session.set('setPriorityAnswer', undefined);
      // $('#prio-buttons').slideUp();
/*      $("#prio-buttons button").addClass('disabled');*/
      return true;
    }
  },
  // could work with some JS in html (also delete #prio-buttons display none)
  // style=" {{#if hidePrioButtons}}display: none;{{/if}}"
  // hidePrioButtons: function () {
  //   if(this.acceptEmbrace===true || this.acceptPositive===true || this.acceptNegative===true || this.acceptHate===true || this.acceptAvoid===true){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // },
  // SOLVED with checkAnswers animations -> delete in future
  // choosePriority: function () {
  //   if(Session.get("setPriorityAnswer")!==undefined){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // },
  photo: function () {
    if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.photo){
      return Meteor.user().profile.photo;
    }
  }
});

Template.game_answer_selection.events({
  'click #answer-embrace': function (event) {
    if(this.acceptEmbrace===true){
      Turns.update({_id: this._id}, {$set: {acceptEmbrace: false}});
/*      $('#check-answer-embrace').prop('checked', false);*/
    }else{
      Turns.update({_id: this._id}, {$set: {acceptEmbrace: true}});
/*      $('#check-answer-embrace').prop('checked', true);*/
    }
  },
  'click #answer-positive': function (event) {
    if(this.acceptPositive===true){
      Turns.update({_id: this._id}, {$set: {acceptPositive: false}});
/*      $('#check-answer-positive').prop('checked', false);*/
    }else{
      Turns.update({_id: this._id}, {$set: {acceptPositive: true}});
/*      $('#check-answer-positive').prop('checked', true);*/
    }
  },
  'click #answer-negative': function (event) {
    if(this.acceptNegative===true){
      Turns.update({_id: this._id}, {$set: {acceptNegative: false}});
/*      $('#check-answer-negative').prop('checked', false);*/
    }else{
      Turns.update({_id: this._id}, {$set: {acceptNegative: true}});
/*      $('#check-answer-negative').prop('checked', true);*/
    }
  },
  'click #answer-hate': function (event) {
    if(this.acceptHate===true){
      Turns.update({_id: this._id}, {$set: {acceptHate: false}});
/*      $('#check-answer-hate').prop('checked', false);*/
    }else{
      Turns.update({_id: this._id}, {$set: {acceptHate: true}});
/*      $('#check-answer-hate').prop('checked', true);*/
    }
  },
  'click #answer-avoid': function (event) {
    if(this.acceptAvoid===true){
      Turns.update({_id: this._id}, {$set: {acceptAvoid: false}});
/*      $('#check-answer-avoid').prop('checked', false);*/
    }else{
      Turns.update({_id: this._id}, {$set: {acceptAvoid: true}});
/*      $('#check-answer-avoid').prop('checked', true);*/
    }
  },
  'click #low': function () {
    Turns.update({_id: this._id}, {$set: {importance: 'low', activeUserHasChoosenAnswerPriority: true}});
    // Session.set('setPriorityAnswer', true);
    $('#low').addClass("btn-primary");
    $('#high').removeClass("btn-primary");
    Session.set("gameCardId", undefined);
    Meteor.call("finishMatch", this.gameId, this.matchId);
  },
  'click #high': function () {
    Turns.update({_id: this._id}, {$set: {importance: 'high', activeUserHasChoosenAnswerPriority: true}});
    // Session.set('setPriorityAnswer', true);
    $('#high').addClass("btn-primary");
    $('#low').removeClass("btn-primary");
    Session.set("gameCardId", undefined);
    Meteor.call("finishMatch", this.gameId, this.matchId);
  }
});
