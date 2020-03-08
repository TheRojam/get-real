Session.set("incompleteQuestionContribution", true);
Session.set("incompleteLocationContribution", true);
Session.set("incompleteAreaContribution", true);

Template.contribution.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('UserContributions');
    self.subscribe('EventRegistration');
  });
});

Template.contribution.helpers({
  userContributions: function() {
    var userId = Meteor.userId();
    var quiestionContribution = userGameCardContributions.find({ creatorId: userId }, {sort: {createdAt: -1}}).fetch();
    var locaitonContribution = userLocationContributions.find({ creatorId: userId }, {sort: {createdAt: -1}}).fetch();
    var areaContribution = userAreaContributions.find({ creatorId: userId }, {sort: {createdAt: -1}}).fetch();
    var summary = {
      questions: quiestionContribution,
      locations: locaitonContribution,
      areas: areaContribution
    };
    // console.log("Question Contributions: " + summary.questions.length);
    return summary;
  },
  dateFormat: function(date) {
    moment.locale(TAPi18n.getLanguage());
    return moment(date).format('L - LT');
  },
  contributed: function(contributions) {
    var allContributions = contributions.questions.length + contributions.locations.length + contributions.areas.length;
    // console.log("All userContributions: " + allContributions);
    if ( allContributions === 0 ){
      return true;
    }else{
      return false;
    }
  }/*,
  userInGame: function(contributions) {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    if ( ticket.status === "bought" || ticket.status === "converted" ){
      return true;
    }else{
      return false;
    }
  }*/
});


Template.contribution.events({
  // back to current step
  'click #back-btn': function (event) {
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  }
});

Template.contribution.onRendered(function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});


/*function onBackButtonDown(event) {
  if ( Session.get('backUrl') ){
    Session.set("userUrl", Session.get('backUrl'));
  }else{
    Session.set("userUrl", "/redirect");
  }
  FlowRouter.go(Session.get("userUrl"));
}*/