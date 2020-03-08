Template.change_password.onCreated(function() {

});

Template.change_password.helpers({
  errorRegister: function() {
    if (Session.get('errorRegister') !== undefined) {
      return Session.get('errorRegister');
    }
  }
});

Template.change_password.events({
  'click #change-password-btn': function(e, t) {
    e.preventDefault();
    if ((oldPassword = trimInput(t.$('#old-password').val())) === "") {
      Session.set('errorRegister', TAPi18n.__("password_invalid"));
      return false;
    }
    if ((newPassword = trimInput(t.$('#new-password').val())) === "") {
      Session.set('errorRegister', TAPi18n.__("password_invalid"));
      return false;
    }
    if ((passwordConfirmation = trimInput(t.$('#new-password-confirmation').val())) === "") {
      Session.set('errorRegister', TAPi18n.__("password_confirmation_not_valid"));
      return false;
    }
    if (newPassword !== passwordConfirmation) {
      Session.set('errorRegister', TAPi18n.__("passwords_not_identical"));
      return false;
    }
    if (newPassword.length <= 4) {
      Session.set('errorRegister', TAPi18n.__("password_too_short"));
      return false;
    }

    Accounts.changePassword(oldPassword, newPassword, (error) => {
      if(error) {
        return console.log(error);
      }
      Session.set('errorRegister', TAPi18n.__("password_changed"));
      Meteor.logout();
      Session.set("userUrl", "/");
      FlowRouter.go(Session.get("userUrl"));
    });

  },
  "click #go-profile": function(event) {
    event.preventDefault();
    Session.set("userUrl", "/profile_me");
    FlowRouter.go(Session.get("userUrl"));
  }
});
