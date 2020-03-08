
Template.support.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }

});

Template.support.helpers({

});

  // Meteor.users.update({ _id: "yaxk67HHif6hsYdAN" }, { $set: { "acceptedOnPrinciples": true }});


Template.support.events({

  'click #back-btn': function (event) {
    if ( Session.get('backUrl') ){
      Session.set("userUrl", Session.get('backUrl'));
    }else{
      Session.set("userUrl", "/redirect");
    }
    FlowRouter.go(Session.get("userUrl"));
  }

});

Template.support.onRendered(function() {
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