
Template.principles.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
    self.autorun(function() {

      self.subscribe('userData');

    });
});

Template.principles.helpers({
  allAccepted: function() {
    var user  = Meteor.users.findOne({ _id: Meteor.userId() });
    // console.log("Invitations: " + invitations.length);
    if ( user.acceptedBeforePrinciples === true && user.acceptedOnPrinciples === true && user.acceptedAfterPrinciples === true ){
      return true;
    }else{
      return false;
    }
  },
  acceptedBeforePrinciples: function() {
    var user  = Meteor.users.findOne({ _id: Meteor.userId() });
    // console.log("Invitations: " + invitations.length);
    if ( user.acceptedBeforePrinciples === true ){
      return true;
    }else{
      return false;
    }
  },
  acceptedOnPrinciples: function() {
    var user  = Meteor.users.findOne({ _id: Meteor.userId() });
    // console.log("Invitations: " + invitations.length);
    if ( user.acceptedOnPrinciples === true ){
      return true;
    }else{
      return false;
    }
  },
  acceptedAfterPrinciples: function() {
    var user  = Meteor.users.findOne({ _id: Meteor.userId() });
    // console.log("Invitations: " + invitations.length);
    if ( user.acceptedAfterPrinciples === true ){
      return true;
    }else{
      return false;
    }
  },
  profileIncomplete: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photoName
        && Meteor.user().profile && Meteor.user().profile.birthYear
        && Meteor.user().profile.genderWanted
        && Meteor.user().profile.gender && Meteor.user().profile.name) {
      if (Meteor.user().profile.youngerWanted || Meteor.user().profile.sameWanted || Meteor.user().profile.olderWanted) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
    ////////////////////////// no language select in v1, only 'de' ///////////////////////
    // has to be added for the profile check
    // && Meteor.user().profile.language
    ////////////////////////// no language select in v1, only 'de' ///////////////////////
  }
});

  // Meteor.users.update({ _id: "yaxk67HHif6hsYdAN" }, { $set: { "acceptedOnPrinciples": true }});


Template.principles.events({
  "click #principles_before_date": function(event, template) {
    event.preventDefault();
    Meteor.call("setUserAcceptance", "acceptedBeforePrinciples", function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },

  "click #principles_on_date": function(event, template) {
    event.preventDefault();
    Meteor.call("setUserAcceptance", "acceptedOnPrinciples", function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },

  "click #principles_after_date": function(event, template) {
    event.preventDefault();
    Meteor.call("setUserAcceptance", "acceptedAfterPrinciples", function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },

  "click #btn_all_accepted": function() {
    var user = Meteor.user();
    if ( user && user.acceptedBeforePrinciples === true && user.acceptedOnPrinciples === true && user.acceptedAfterPrinciples === true ){
      Session.set("userUrl", "/profile_me");
      FlowRouter.go(Session.get("userUrl"));
    }
  },

  'click #back-btn': function (event) {
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  }

});

Template.principles.onRendered(function() {
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});


/*function onBackButtonDown(event) {
  var user = Meteor.user();
  if ( user && user.acceptedBeforePrinciples === true && user.acceptedOnPrinciples === true && user.acceptedAfterPrinciples === true ){
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  }
}*/