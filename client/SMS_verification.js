Template.SMS_verification.onCreated(function() {

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

Template.SMS_verification.events({

  // for question contributions

  'click #sent_verification_code': function (event) {

    var userId = Meteor.userId();
    var verification_code = $('#verification_code').val();
    if ( userId && verification_code ) {
      Meteor.call("verifySMS", userId, verification_code, function (err, result) {
        if (err) {
          // console.log(err);
        }
        // console.log(result);
        if (result === false) {
          $("#verification_code_helper").text(TAPi18n.__('invalid_verification_code'));
        }else{
          Session.set("userUrl", "/redirect");
          FlowRouter.go(Session.get("userUrl"));
        }
      });
    }
  },
  'blur #sent_verification_code': function (event) {
    $("#verification_code_helper").text("");
    $("#verification_code").val("");
    M.updateTextFields();
  },
  'click #resend_SMS_btn': function (event) {
    var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
    Meteor.call("sendCodeSMS", userData.OTP, userData.username,  function (err, result) {
      if (err) {
        console.log(err);
      }
    });
  },
  'click #SMS-logout': function () {
    $(".sidenav-overlay").hide(); // needed because meteor switches too fast
    Meteor.logout();
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  }
});




Template.SMS_verification.helpers({
  SMSDelay: function()
  {
      var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
      var earlier = new moment().subtract(10, 'minutes').toDate();
      if ( userData && (userData.SMSsendDate <= earlier || userData.SMSsendDate === undefined) ){
        return true;
      }else{
        return false;
      }
  },
  userName: function()
  {
      var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
      return userData.username;
  }
});