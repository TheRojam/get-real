Meteor.Spinner.options = {
  lines: 13, // The number of lines to draw
  length: 10, // The length of each line
  width: 5, // The line thickness
  radius: 15, // The radius of the inner circle
  corners: 0.7, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#FF8291', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 30, // The z-index (defaults to 2000000000)
};

Template.redirect.onCreated(function() {

  if ( Meteor.userId() ){
    Meteor.call("getUserUrl", Meteor.userId(), function (err, result){
      if (err) {
        console.log(err);
      }
      console.log("New URL: " + result);
      // Meteor.call("getUserUrl", Meteor.user());
      TAPi18n.setLanguage(Meteor.user().profile.language);
      Session.set("userUrl", result);
      FlowRouter.go(Session.get("userUrl"));
    });
  }else{
    Meteor.logout();
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  }





// THE LANGUAGE NEEDS TO BE RELOADED ONCE THE SESSION IS LOST
    // var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
    // TAPi18n.setLanguage(userData.profile.language);

});
