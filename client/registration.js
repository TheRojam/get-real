Template.registration.helpers({
  errorRegister: function () {
    if (Session.get('errorRegister') !== undefined) {
      return Session.get('errorRegister');
    }
  },
  mobilePhone: function () {
    if (Session.get('mobilePhone') !== undefined) {
      return Session.get('mobilePhone');
    }
  }
});

Template.registration.events({
  "click #save_data_user_first_screen": function(event, template) {
    event.preventDefault();
    var phone = trimInput(template.$('#login-number').val());
    phone = phone.replace(/\s/g, '');
    var password = null,
        username = null,
        pattern = phone.match(/^(((((((\+)491[ \-\/]?))[1-9][0-9]{4,12})[ \-\/]?)|((((00|\+)491\()|\(0)[1-9][0-9]{4,12}\)[ \-\/]?))[0-9]{4,12}([ \-\/]?[0-9]{4,12})?)$/g);
    if (pattern === null) {
      Session.set('errorRegister', TAPi18n.__("number_not_valid"));
      return false;
    } else {
      Session.set('mobilePhone', phone.toString());
    }
    if (phone.length > 15) {
      Session.set('errorRegister', TAPi18n.__("number_too_long"));
      return false;
    }
    if ((password = trimInput(template.$('#login-password').val())) === undefined) {
      Session.set('errorRegister', TAPi18n.__("password_invalid"));
      return false;
    }
    if ((passwordConfirmation = trimInput(template.$('#login-password-confirmation').val())) === undefined) {
      Session.set('errorRegister', TAPi18n.__("password_confirmation_not_valid"));
      return false;
    }
    if (password !== passwordConfirmation) {
      Session.set('errorRegister', TAPi18n.__("passwords_not_identical"));
      return false;
    }
    if (password.length <= 4) {
      Session.set('errorRegister', TAPi18n.__("password_too_short"));
      return false;
    }
    Meteor.loginWithPassword(phone, password, function(err) {
/*      console.log(err);*/
      if (err && err.reason && err.reason === "User not found") {

        /* for SMS verification */
        const min = 10000,
          max = 99999,
          OTP = Math.floor(Math.random() * (max - min + 1)) + min;
        Accounts.createUser({
          username: phone,
          password : password,
          OTP: OTP,
          isMobileVerified: false
        }, function(err) {
          if (err) {
            Session.set('errorRegister', err.reason);
            Log.error(err);
          } else {
            //Log.info("New user created");

            // adds two invitation codes
            Meteor.call('addIUserInvitation', phone, (error) => {
              if(error) {
                return console.log(error);
              }
            });
            Meteor.call('addIUserInvitation', phone, (error) => {
              if(error) {
                return console.log(error);
              }
            });

            // send SMS verification code
            Meteor.call('sendCodeSMS', OTP, phone, (error) => {
              if(error) {
                return console.log(error);
              }
            Session.set("userUrl", "/redirect");
            FlowRouter.go(Session.get("userUrl"));
            });
          }
        });
      } else if (err && err.reason) {
        Session.set('errorRegister', err.reason);
      } else if (err === undefined) {
        Session.set('errorRegister', TAPi18n.__("user_already_exists"));
      }
    });
  },
  "focus input#login-number": function(event) {
    if ( $( "#login-number" ).val() === "" ) {
      $( "#login-number" ).val("+49");
    }
  },
  "click #goToLoginBtn": function(event) {
    event.preventDefault();
    Session.set('errorRegister', undefined);
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  },
});

Template.registration.onRendered = function() {
  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };
};

function onBackButtonDown(event) {
  Session.set("userUrl", "/");
  FlowRouter.go(Session.get("userUrl"));
}