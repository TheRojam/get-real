Template.reset_password.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('allNumbers');
  });
});

// Template.reset_password.onRendered(function () {
//   $('.sidenav').sidenav();
//   $('.tooltipped').tooltip();
//   $('select').formSelect();
// });

Template.reset_password.helpers({
  errorRegister: function() {
    if (Session.get('errorRegister') !== undefined) {
      return Session.get('errorRegister');
    }
  },
  mobilePhone: function() {
    if (Session.get('mobilePhone') !== undefined) {
      return Session.get('mobilePhone');
    }
  }/*,
  token: function() {
    return FlowRouter.getParam('token');
  }*/
});

Template.reset_password.events({
  'click #send-reset-btn': function(e, t) {
    e.preventDefault();
    var  phone = trimInput(t.$('#reset-number').val());
    var  userName = trimInput(t.$('#reset-name').val());
    var  birthYear = trimInput(t.$('#reset-birthyear').val());
    phone = phone.replace(/\s/g, '');
/*    console.log("phone: " + phone);*/
    var pattern = phone.match(/^(((((((\+)491[ \-\/]?))[1-9][0-9]{4,12})[ \-\/]?)|((((00|\+)491\()|\(0)[1-9][0-9]{4,12}\)[ \-\/]?))[0-9]{4,12}([ \-\/]?[0-9]{4,12})?)$/g);
    if (pattern === null) {
      Session.set('errorRegister', TAPi18n.__('number_not_valid'));
      return false;
    } else {
      // check for existing number
      var password = "";
      Meteor.loginWithPassword(phone, password, function(err) {
        if (err && err.reason && err.reason === "User not found") {
          Log.info(err.reason);
          Session.set('errorRegister', TAPi18n.__("number_not_found"));
          return false;
        } else if (err && err.reason) {
          // Number exists, e.g. but wrong password

          Meteor.call('sendResetSMS', phone, userName, birthYear, (error, result) => {
            if(error) {
              return console.log(error);
            }
            if ( result === "send" ){
              return Session.set('errorRegister', TAPi18n.__("reset_pswd_sms_send"));
            }else if ( result === "tooEarly" ) {
              $('#reset-number').val("");
              $('#reset-name').val("");
              $('#reset-birthyear').val("");
              return Session.set('errorRegister', TAPi18n.__("retry_sms_later"));
            }else{
              return Session.set('errorRegister', TAPi18n.__("no_match_found"));
            }
          });
        } else {
          Session.set("userUrl", "/");
          FlowRouter.go(Session.get("userUrl"));
        }
      });
    }
  },
  "focus input#reset-number": function(event) {
    if ( $( "#reset-number" ).val() === "" ) {
      $( "#reset-number" ).val("+49");
/*      console.log("added stuff");*/
    }
  },
  "click #goToLoginBtn": function(event) {
    Session.set('errorRegister', undefined);
    event.preventDefault();
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  }
});
