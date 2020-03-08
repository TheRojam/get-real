Template.procedure.onCreated(function() {

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

Template.procedure.onRendered(function () {
  $('.collapsible').collapsible();
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});

Template.procedure.events({
  'click #btn_seen_procedure': function (event) {
    if (Meteor.users.update({ _id: Meteor.userId() },  {$set: {seenProcedure: true}})) {
      console.info('User ' + Meteor.userId() + " has seen the APP procedure");
      Session.set("userUrl", "/principles");
      FlowRouter.go(Session.get("userUrl"));
      return true;
    }else{
      return false;
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


Template.procedure.helpers({
  seenProcedure: function() {
    // console.info('User.seenProcedure ' + Meteor.users.findOne({ _id: Meteor.userId() }).seenProcedure );
    return Meteor.users.findOne({ _id: Meteor.userId() }).seenProcedure;
  }
});


/*function onBackButtonDown(event) {
  var user = Meteor.user();
  if ( user && user.seenProcedure === true ){
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  }else{
    return false;
  }
}*/