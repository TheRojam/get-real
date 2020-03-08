Template.messages_history_match.helpers({
  userAnswer: function() {
    var questionAlignment = null;
    var answerAlignment = null;
    //console.log(this);
    if (this.givenAnswer && this.question && Meteor.userId()) {
      if (this.givenAnswer !== undefined && this.givenAnswer !== 'default' && (Meteor.userId() === this.passiveId)) {
        // Turn where user is passive;
        questionAlignment = 'animated bounceInLeft left';  // order is important
        answerAlignment = 'animated bounceInRight right';
      }
      if (this.question!==undefined && this.question !== 'default' && (Meteor.userId() === this.activeId)) {
        // Turn where user is active;
        questionAlignment = 'animated bounceInRight right';
        answerAlignment = 'animated bounceInLeft left';
      }
      // DGB 2015-01-09 12:54
      // Using eval is spaguetti code. However I consider it easier to understand and maintain than a massive machine state.
      if (this.activeUserHasChoosenQuestion && this.activeUserHasChoosenAnswerPriority) {
        if ( this.givenAnswerImportance !== "Avoid" ){
          var acceptedAnswer = eval('this.accept' + this.givenAnswerImportance);
          var answerClass = ((acceptedAnswer) ? 'accepted':'wrong') + ' ' + ((this.importance === 'high') ? 'high':'low');
          // console.log(acceptedAnswer + " : " + this.givenAnswerImportance);
        }else{
          var answerClass = "avoid";
        }
      }else{
        var answerClass = "";
      }
      var finalAnswer = 'answer' + this.givenAnswerImportance;

      return '<div class="' + answerClass + '"><div class="' +
        questionAlignment + '-question"><div class="' + questionAlignment +
        '-bubble"><div class="game-message-question">' + this.question +
        '</div></div></div><div class="' + answerAlignment + '-answer"><div class="' +
        answerAlignment + '-bubble"><div class="game-message-answer ">'+
        this[finalAnswer]+'</div></div></div></div><div class="question_line"></div>';
    }
  },
  userIsActive: function() {
    return Meteor.userId() === this.activeId;
  },
  userIsPassive: function() {
    return Meteor.userId() === this.passiveId;
  },
  profilePhoto: function() {
    return Meteor.users.findOne({_id: this.activeId}).profile.photo;
  },
  blurImage: function() {
      if (Meteor.userId() === this.passiveId){
      var numberTurns = this.turnNumber - 1;
      var matchFinished = Matches.findOne({ _id: this.matchId }).isFinished;
      var maxTurns = Games.findOne({ _id: this.gameId }).maxTurns;
      if (numberTurns < maxTurns/3){
        return blurImagesOnGame(3);
      }
      if (numberTurns >= maxTurns/3 && numberTurns < maxTurns/1.5){
        return blurImagesOnGame(2);
      }
      if (numberTurns >= maxTurns/1.5 && numberTurns <= maxTurns ){
        return blurImagesOnGame(1);
      }
    }else{
      return blurImagesOnGame(0);
    }
  }
});