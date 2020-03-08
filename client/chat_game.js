RationalRanks = {
  beforeFirst: function(firstRank) {
    return firstRank - 1;
  },
  between: function(beforeRank, afterRank) {
    return (beforeRank + afterRank) / 2;
  },
  afterLast: function(lastRank) {
    return lastRank + 1;
  }
};

/**
 * [updateIndexes description]
 * @param  {[type]} matches   [description]
 * @param  {[type]} idUser    [description]
 * @param  {[type]} rankingid [description]
 * @param  {[type]} rank      [description]
 * @return {[type]}           [description]
 */
var updateIndexes = function(matches, idUser, rankingid, rank) {
  // console.log('Matches: ', matches);
  matches.each(function(i, obj) {
    var children = $(obj).get(0).children;
    // console.log('children: ', children);
    $.each(children, function(index, child) {
      child.attributes['data-position'].value = index + 1;
      var correctPosition = child.attributes['data-position'].value;
      // console.log('Position: ', secondLevel[0].children[0].attributes['data-position'].value);
      // console.log('Ranking id: ', secondLevel[0].children[0].attributes['data-rankingid'].value);
      RankingGames.update({ _id: new Mongo.ObjectID(child.attributes['data-rankingid'].value) }, { $set: { position: correctPosition } });
      // OLD CODE somehow needed to nest one level deeper
      // var secondLevel = $(child).get(0).children;
      // secondLevel[0].children[0].attributes['data-position'].value = index + 1;
      // var correctPosition = secondLevel[0].children[0].attributes['data-position'].value;
      // // console.log('Position: ', secondLevel[0].children[0].attributes['data-position'].value);
      // // console.log('Ranking id: ', secondLevel[0].children[0].attributes['data-rankingid'].value);
      // RankingGames.update({ _id: new Mongo.ObjectID(secondLevel[0].children[0].attributes['data-rankingid'].value) }, { $set: { position: correctPosition } });
      // console.log(RankingGames.findOne({_id: new Mongo.ObjectID(secondLevel[0].children[0].attributes['data-rankingid'].value)}));
    });
  });
};


Template.chat_game.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
    self.autorun(function() {
      self.subscribe('CurrentGame');
      self.subscribe('Turns', getUserLanguage());
      self.subscribe('GameCards', getUserLanguage());
      self.subscribe('userData');
    });

  Session.set('backUrl', '/chat_game'); // inside a game
});


// Template.chat_game.invokeAfterLoad = function () {
//   Meteor.defer(function () {
//     $(".ranking-list li").sort(sort_li).appendTo('.ranking-list');
//     function sort_li(a, b)
//     {
//       return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;
//     }
//   });
//   return "";
// };

Template.chat_game.onRendered(function() {

  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackInChat, false);
  };

});


function onBackInChat(event) {
  event.preventDefault();
  event.stopPropagation();
  Session.set("selectedMatch", undefined ); // hide old Match
  $(".chat-box").hide();
  $("#menu-box").show();
}

Template.chat_game.events({
  // 'click #back': function(event) {
  //   Session.set("userUrl", "/game");
  //   FlowRouter.go(Session.get("userUrl"));
  // },
  'click #event': function(event) {
    Session.set("userUrl", "/event");
    FlowRouter.go(Session.get("userUrl"));
  },
  // shows sortable menu
  'click #prioritize_btn': function(event) {
    var objMatches = $('#sortable-matches');
    objMatches.sortable({ // uses the 'sortable' interaction from jquery ui
      stop: function(event, ui) { // fired when an item is dropped
        var el = ui.item.get(0);
        var before;
        if (ui && ui.item && ui.item.prev() && ui.item.prev().get(0)) {
          before = ui.item.prev().get(0);
        }
        var after;
        if (ui && ui.item && ui.item.next() && ui.item.next().get(0)) {
          after = ui.item.next().get(0);
        }
        var newRank;
        if (!before) { // moving to the top of the list
          newRank = RationalRanks.beforeFirst(UI.getData(after).ranking.position);
        } else if (!after) { // moving to the bottom of the list
          newRank = RationalRanks.afterLast(UI.getData(before).ranking.position);
        } else {
          newRank = RationalRanks.between(UI.getData(before).ranking.position, UI.getData(after).ranking.position);
        }
        if (!newRank) {
          newRank = 0;
        }
        updateIndexes(objMatches, UI.getData(el)._id, UI.getData(el).ranking._id, Number(newRank));
      }
    });
    $(".link-icon").fadeOut( "fast", function() {
      $( ".sort-icon" ).fadeIn( "fast" );
    });
    $("#chat_menu_header").fadeToggle( "fast", function() {
      $( "#please_prioritize" ).fadeToggle( "fast" );
    });

    // $(".ranking-profile-rank").animate({width:'toggle'},350);
    // $("#please_prioritize").slideDown();
    // $("#chat_menu_header").slideUp();
    $("#menu_btn").show();
    $("#prioritize_btn").hide();
    $(".matchSelector").toggleClass('matchSelector prioSelector');
    // $(".prioSelector").removeClass('navigate-right');
    $("#prio-tooltipp").fadeOut( "fast");
  },

  // shows chat_menu
  'click #menu_btn': function(event) {
    $(".sort-icon").fadeOut( "fast", function() {
      $( ".link-icon" ).fadeIn( "fast" );
    });
    $("#please_prioritize").fadeToggle( "fast", function() {
      $( "#chat_menu_header" ).fadeToggle( "fast" );
    });
    // $(".ranking-profile-rank").animate({width:'toggle'},350);
    // $("#please_prioritize").slideUp();
    // $("#chat_menu_header").slideDown();
    $("#menu_btn").hide();                                         // switch buttons
    $("#prioritize_btn").show();                                   // switch buttons
    $(".prioSelector").toggleClass('prioSelector matchSelector');  // for disabling links
    // $(".matchSelector").addClass('navigate-right');                // show navigate right
    $("#sortable-matches").sortable("destroy");                    // stops sortable; disable breaks the enable later
    $("#prio-tooltipp").fadeIn( "fast" );
  },

  'click .matchSelector': function(event) {
    Session.set("selectedMatch", new Mongo.ObjectID(event.currentTarget.dataset.matchid));
    Session.set("idPlayerSelected", event.currentTarget.dataset.id);
    // console.log("matchId: " + Session.get("selectedMatch"));
    $("#menu-box").hide();
    $(".chat-box").show();

    // jitters
    // $("#menu-box").fadeOut( "fast", function() {
    //   $( ".chat-box" ).fadeIn( "fast" );
    // });
  },
  'click .chat_menu_btn': function (event) {
    Session.set("selectedMatch", undefined ); // hide old Match
    $(".chat-box").hide();
    $("#menu-box").show();
    // jitters
    // $(".chat-box").fadeOut( "fast", function() {
    //   $( "#menu-box" ).fadeIn( "fast" );
    // });
  },
  'click #modal-first-time-chat-btn': function () {
    Meteor.users.update( Meteor.userId(), {$set: { "firstTimeChat": false }} );
  }
});

Template.chat_game.helpers({


  // colors the back to chat_menu in red to call user, toasts might be too intrusive

  callToMenu: function(){

    var call = false;
    var arrayMatches = [];
    var matchesCollection = Matches.find().fetch();
    matchesCollection.forEach(function(match) {
      if ( match._id.toString() !== Session.get('selectedMatch').toString() ){

        var turn = Turns.findOne({ matchId: match._id, gameId: match.gameId }, {sort: {createdAt: -1, limit: 1}});
        // console.log("turn: "+turn._id);
        var lastActiveTurn = Turns.findOne({matchId: match._id, gameId: match.gameId, activeId: Meteor.userId()}, {sort: {createdAt: -1}, limit:1});
        // console.log("lastActiveTurn: "+lastActiveTurn._id);
        // console.log("matchId: " + match._id.toString() );
        // console.log("Session matchId: " + Session.get('selectedMatch').toString());
        // console.log("own turn: " + (match._id.toString() === Session.get('selectedMatch').toString()));
        if ( (turn.activeId === Meteor.userId() && !turn.activeUserHasChoosenQuestion) || (lastActiveTurn && lastActiveTurn.activeId === Meteor.userId() && lastActiveTurn.activeUserHasChoosenQuestion === true && !lastActiveTurn.activeUserHasChoosenAnswerPriority) || (turn.passiveId === Meteor.userId() && turn.activeUserHasChoosenQuestion === true && turn.givenAnswerImportance === "false" && (!lastActiveTurn || (lastActiveTurn && lastActiveTurn.activeUserHasChoosenAnswerPriority))) ){

          call = true;

        }

      }
    });
    // console.log("callToMenu: " + call);
    return call;
  },
  gameData: function(){
    var arrayMatches = [];
    var matchesCollection = Matches.find().fetch();
    matchesCollection.forEach(function(match) {
      if (match.playerOneId === Meteor.userId()) {
        match.otherPlayer = Meteor.users.findOne({ _id: match.playerTwoId });
      } else {
        match.otherPlayer = Meteor.users.findOne({ _id: match.playerOneId });
      }
      if (match.bestMatch) {
        match.location = Locations.findOne({ _id: match.locationId });
      }
      match.ranking = RankingGames.findOne({
        creatorId: Meteor.userId(),
        gameId: match.gameId,
        userIdRanked: match.otherPlayer._id
      });

      var turn = Turns.findOne({ matchId: match._id, gameId: match.gameId }, {sort: {createdAt: -1, limit: 1}});
      // console.log("turn: "+turn._id);
      // thought I needed the last turn to analyse
      // var lastTurn = Turns.find({matchId: match._id, gameId: match.gameId, createdAt: {$lt: turn.createdAt}}, {sort: {createdAt: -1}, limit:1}).fetch()[0];
      // console.log("lastTurn: "+lastTurn._id);
      // will try with last turn where user was activeId
      var lastActiveTurn = Turns.findOne({matchId: match._id, gameId: match.gameId, activeId: Meteor.userId()}, {sort: {createdAt: -1}, limit:1});
      // console.log("lastActiveTurn: "+lastActiveTurn._id);

      if ( turn.activeId === Meteor.userId() && !turn.activeUserHasChoosenQuestion ){
        match.status = "help"
        // M.toast({html: 'You have to ask!'});
      }
      if ( lastActiveTurn && lastActiveTurn.activeId === Meteor.userId() && lastActiveTurn.activeUserHasChoosenQuestion === true && !lastActiveTurn.activeUserHasChoosenAnswerPriority ){
        match.status = "check_box"
        // M.toast({html: 'You have to select acceptable answers!'});
      }
      if ( turn.passiveId === Meteor.userId() && turn.activeUserHasChoosenQuestion === true && turn.givenAnswerImportance === "false" && (!lastActiveTurn || (lastActiveTurn && lastActiveTurn.activeUserHasChoosenAnswerPriority)) ){
        match.status = "announcement"
        // M.toast({html: 'You have to answer!'});
      }
      if ( match.isFinished ){
        match.status = "thumb_up"
        // done_all, thumb_up,check_circle, check - try different icons
      }
      // console.log(turn.activeId === Meteor.userId);


      var rankedUser = RankingGames.findOne({
        creatorId: Meteor.userId(),
        gameId: match.gameId,
        userIdRanked: match.otherPlayer._id
      });
      if (rankedUser) {
        var ranking = RankingGames.findOne({
          creatorId: Meteor.userId(),
          gameId: match.gameId,
          userIdRanked: match.otherPlayer._id
        });
      }
      arrayMatches.push(match);
    });

    // arrayMatches.sort(function(a,b) {
    //   return a.ranking.position > b.ranking.position;
    // });

    arrayMatches.sort(function(a,b) {
    return b.ranking.position < a.ranking.position ? 1 : -1;
    });

    var tmp = {
      matches: arrayMatches,
      matchesCount: (arrayMatches.length || 0),
      game: Games.findOne({}),
      name: Meteor.user().username
    };
    return tmp;
  },

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
  countdownClock: function() {
    var gameFinish = Games.findOne();
    // console.log("Gamefinish for countdown: " + gameFinish.gameFinish);
    if(gameFinish){
     return CountdownClock(gameFinish.gameFinish, '/event', 'h');
    }
  },
  addOne: function(index) {
    return index + 1;
  },
  inTutorial: function() {
    if ( Meteor.user().context == "tutorial" ) {
      return true;
    }else{
      return false;
    }
  },

  // game.js stuff
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
  passiveSelectedAnswer: function (answerString) {
    if( answerString === "false"){
      return false;
    }else{
      return true;
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
      window.setTimeout(function () {
        var objControl = $("#chat-view");
        objControl.scrollTop = objControl.scrollHeight;
      }, 100);
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
  showAge: function(matchId) {
    var turns = Turns.find({ matchId: matchId }).fetch();
    var numberTurns = turns.length;
    var maxTurns = Games.findOne({ _id: turns[0].gameId }).maxTurns;
    if (numberTurns >= maxTurns/1.5 && numberTurns <= maxTurns){
      return true;
    }
  },
  scrollDown: function(matchId) {
    // var objControl = $("#chat-view");
    $("html, body").animate({ scrollTop: $(document).height() }, 500);
  },
  firstTime: function() {
    var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
    if ( userData.firstTimeChat !== undefined ){
      return userData.firstTimeChat;
    }else{
      return true;
    }
  }
});
