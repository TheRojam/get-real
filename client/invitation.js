
Template.invitation.onCreated(function() {

  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }
  var self = this;
    self.autorun(function() {

      self.subscribe('UserInvitations');
      self.subscribe('CurrentGame');
    });
});

Template.invitation.helpers({
  userInvitations: function() {
    var userId = Meteor.userId();
    var invitations = userInvitations.find({ userId: userId }, {sort: {createdAt: -1}}).fetch();
    // console.log("Invitations: " + invitations.length);
    return invitations;
  },
  invitedUserName: function(invitedId) {
    // var invitedUser = Meteor.users.find({ _id: invitedId }).fetch()[0];
    var invitedUser = Meteor.users.findOne({ _id: invitedId });

    // console.log("invitedUserId: " + invitedId);
    // console.log("invitedUser: " + invitedUser);
    if ( invitedUser && invitedUser.profile ){
      return invitedUser.profile.name;
    }
  },
  noInvitations: function() {
    var userId = Meteor.userId();
    var invitations = userInvitations.find({ userId: userId }, {sort: {createdAt: -1}}).fetch();
    // console.log("Invitations: " + invitations.length);
    if ( invitations.length === 0 ){
      return true;
    }else{
      return false;
    }
  }
});

Template.invitation.onRendered = function() {
  new ClipboardJS('.copy-btn');
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
};

/*function onBackButtonDown(event) {
  if ( Session.get('backUrl') ){
    Session.set("userUrl", Session.get('backUrl'));
  }else{
    Session.set("userUrl", "/redirect");
  }
  FlowRouter.go(Session.get("userUrl"));
}*/

Template.invitation.events({
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