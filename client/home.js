Template.home.onCreated(function() {
  if(!Meteor.userId())
  {
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
    return;
  }
});

// Template.home.onRendered(function () {
//   $('.sidenav').sidenav();
//   $('.tooltipped').tooltip();
//   $('select').formSelect();
// });

Template.home.helpers({
  errorRegister: function() {
    if (Session.get('errorRegister') !== undefined) {
      return Session.get('errorRegister');
    }
  },
  mobilePhone: function() {
    if (Session.get('mobilePhone') !== undefined) {
      return Session.get('mobilePhone');
    }
  }
});

Template.home.events({
  'click #login-event': function(e, t) {
    e.preventDefault();
    $("#user-data-helper").text("");
    $("#login-number-helper").text("");
    $("#login-password-helper").text("");
    var  phone = trimInput(t.$('#login-number').val());
    phone = phone.replace(/\s/g, '');
    var password = trimInput(t.$('#login-password').val());
    var pattern = phone.match(/^(((((((\+)491[ \-\/]?))[1-9][0-9]{4,12})[ \-\/]?)|((((00|\+)491\()|\(0)[1-9][0-9]{4,12}\)[ \-\/]?))[0-9]{4,12}([ \-\/]?[0-9]{4,12})?)$/g);
    if (pattern === null) {
/*      Session.set('errorRegister', TAPi18n.__('number_not_valid'));*/
      $("#login-number-helper").text(TAPi18n.__('number_not_valid'));
      return false;
    } else {
      Session.set('mobilePhone', phone.toString());
      $("#login-number-helper").text("");
    }
    if (phone.length > 15) {
/*      Session.set('errorRegister', TAPi18n.__("number_long"));*/
      $("#login-number-helper").text(TAPi18n.__('number_long'));
      return false;
    }else{
      $("#login-number-helper").text("");
    }
    if (trimInput(t.$('#login-password').val()).length <= 4) {
/*      Session.set('errorRegister', TAPi18n.__("password_short"));*/
      $("#login-password-helper").text(TAPi18n.__('password_short'));
      return false;
    }else{
      $("#login-password-helper").text("");
    }
    Meteor.loginWithPassword(phone, password, function(err) {
      if (err && err.reason && err.reason === "User not found") {
/*        Log.info(err.reason);*/
/*        Session.set('errorRegister', TAPi18n.__("incorrect_login_data"));*/
        $("#user-data-helper").text(TAPi18n.__('incorrect_login_data'));
      } else if (err && err.reason) {
/*        Log.info(err.reason);*/
/*        Session.set('errorRegister', TAPi18n.__("incorrect_login_data"));*/
        $("#user-data-helper").text(TAPi18n.__('incorrect_login_data'));
      } else {
        $("#user-data-helper").text("");
        Session.set("userUrl", "/redirect");
        FlowRouter.go(Session.get("userUrl"));
      }
    });
  },
  "focus input#login-number": function(event) {
    if ( $( "#login-number" ).val() === "" ) {
      $( "#login-number" ).val("+49");
/*      console.log("added stuff");*/
    }
  },
  'click .new_user': function() {
    Session.set('errorRegister', undefined);
    Session.set("userUrl", "/registration");
    FlowRouter.go(Session.get("userUrl"));
    Session.set('errorRegister', false);
  },
  'click #reset_password': function() {
    Session.set('errorRegister', undefined);
    Session.set("userUrl", "/reset_password");
    FlowRouter.go(Session.get("userUrl"));
    Session.set('errorRegister', false);
  }
});
