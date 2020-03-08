var locale_var = 'de';

Template.select_birthyear.onRendered(function () {
    $('select').formSelect();
});

// Template.side_nav.onCreated(function() {
//   var self = this;
//   self.autorun(function() {
//     self.subscribe('userData');
//   });
// });
//
Template.select_birthyear.helpers({
  yearSelection: function() {
    var max = moment().year() - 18,
        min = max - 90;
    return _.range(max, min, -1);
  }
});
//
//
// Template.side_nav.events({
//   'click #sn-to-profile': function () {
//     $(".sidenav-overlay").hide(); // needed because meteor switches too fast
//     Session.set("userUrl", "/profile_me");
//     FlowRouter.go(Session.get("userUrl"));
//   },
//   'click #sn-to-event-registration': function () {
//     $(".sidenav-overlay").hide(); // needed because meteor switches too fast
//     Session.set("userUrl", "/event_registration");
//     FlowRouter.go(Session.get("userUrl"));
//   }
// });
