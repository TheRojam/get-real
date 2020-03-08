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
  console.log('Matches: ', matches);
  matches.each(function(i, obj) {
    var children = $(obj).get(0).children;
    console.log('children: ', children);
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


Template.chat_menu.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
    self.autorun(function() {
      self.subscribe('CurrentGame');
      self.subscribe('Turns', getUserLanguage());
    });
});


Template.chat_menu.onRendered(function() {
  // moved to the prioritize button. I think can be removed
  // Session.setDefault("showButtonEvent", undefined);
  // var objMatches = $(this.find('#sortable-matches'));
  // Meteor.setTimeout(function() {
  //
  // this.$('#sortable-matches').slideUp();
  // this.$('#sortable-matches').sortable({ // uses the 'sortable' interaction from jquery ui
  //   stop: function(event, ui) { // fired when an item is dropped
  //     var el = ui.item.get(0);
  //     var before;
  //     if (ui && ui.item && ui.item.prev() && ui.item.prev().get(0)) {
  //       before = ui.item.prev().get(0);
  //     }
  //     var after;
  //     if (ui && ui.item && ui.item.next() && ui.item.next().get(0)) {
  //       after = ui.item.next().get(0);
  //     }
  //     var newRank;
  //     if (!before) { // moving to the top of the list
  //       newRank = RationalRanks.beforeFirst(UI.getData(after).ranking.position);
  //     } else if (!after) { // moving to the bottom of the list
  //       newRank = RationalRanks.afterLast(UI.getData(before).ranking.position);
  //     } else {
  //       newRank = RationalRanks.between(UI.getData(before).ranking.position, UI.getData(after).ranking.position);
  //     }
  //     if (!newRank) {
  //       newRank = 0;
  //     }
  //     updateIndexes(objMatches, UI.getData(el)._id, UI.getData(el).ranking._id, Number(newRank));
  //   }
  // });
  // },5);
  // $(this.find('#sortable-matches')).disableSelection();
});

Template.chat_menu.events({
  // 'click #back': function(event) {
  //   Session.set("userUrl", "/game");
  //   FlowRouter.go(Session.get("userUrl"));
  // },
  'click #event': function(event) {
    Session.set("userUrl", "/event");
    FlowRouter.go(Session.get("userUrl"));
  },
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
  },

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
  },

  'click .matchSelector': function(event) {
    Session.set("selectedMatch", new Mongo.ObjectID(event.currentTarget.dataset.matchid));
    Session.set("idPlayerSelected", event.currentTarget.dataset.id);
    Session.set("userUrl", "/game");
    FlowRouter.go(Session.get("userUrl"));
  }
});

Template.chat_menu.helpers({
  data: function()
  {
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
      }
      if ( lastActiveTurn && lastActiveTurn.activeId === Meteor.userId() && lastActiveTurn.activeUserHasChoosenQuestion === true && !lastActiveTurn.activeUserHasChoosenAnswerPriority ){
        match.status = "playlist_add_check"
      }
      if ( turn.passiveId === Meteor.userId() && turn.activeUserHasChoosenQuestion === true && turn.givenAnswerImportance === "false" && (!lastActiveTurn || (lastActiveTurn && lastActiveTurn.activeUserHasChoosenAnswerPriority)) ){
        match.status = "announcement"
      }
      if ( match.isFinished ){
        match.status = "check_circle"
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

    arrayMatches.sort(function(a,b) {
      return a.ranking.position > b.ranking.position;
    });

    var tmp = {
      matches: arrayMatches,
      matchesCount: (arrayMatches.length || 0),
      game: Games.findOne({}),
      name: Meteor.user().username
    };
    return tmp;
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
  // // here are the 2 minutes for prioritizing
  // timeNotYet: function() {
  //   if (moment().valueOf() < moment(this.game.gameFinish).add(2, 'm').valueOf()) {
  //     return false;
  //   }else {
  //     return true;
  //   }
  // },
  // showButtonEvent: function() {
  //   if (Session.get("showButtonEvent") ===true) {
  //     return true;
  //   }else {
  //     return false;
  //   }
  // },
  // gameFinished: function() {
  //   if (moment().valueOf() < moment(this.game.gameFinish).valueOf()){
  //     return false;
  //   }else {
  //     return true;
  //   }
  // },
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
  }
});
