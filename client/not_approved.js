Template.not_approved.onCreated(function() {
  var self = this;
    self.autorun(function() {
      self.subscribe('userData');
    });
});

Template.not_approved.events({
  // for question contributions
  'click #sent_invitation_code': function (event) {

    var userId = Meteor.userId();
    var invitation_code = $('#invitation_code').val();
    if ( userId && invitation_code ) {
      Meteor.call("redeemInvitationCode", userId, invitation_code, function (err, result) {
        if (err) {
          // console.log(err);
        }
        // console.log(result);
        if (result === false) {
          $("#invitation_code_helper").text(TAPi18n.__('invalid_invitaion_code'));
        }else{
          Session.set("userUrl", "/redirect");
          FlowRouter.go(Session.get("userUrl"));
        }
      });
    }
  },
  'blur #sent_invitation_code': function (event) {
    $("#invitation_code_helper").text("");
    $("#invitation_code").val("");
    M.updateTextFields();
  },
  'click #btn-to-profile': function () {
    Session.set("userUrl", "/profile_me");
    FlowRouter.go(Session.get("userUrl"));
  }
});

Template.not_approved.helpers({
  isApproved: function() {
    if (Meteor.user() && Meteor.user().approved === true) {
      Session.set("userUrl", "/redirect");
      FlowRouter.go(Session.get("userUrl"));
    } else {
      return false;
    }
  },
  wasntAlreadyInvited: function() {
    if (Meteor.user() && Meteor.user().inviterId === undefined) {
      return true;
    } else {
      return false;
    }
  }
});