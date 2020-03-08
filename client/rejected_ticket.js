// TO DO is this necessary, if router.js checks too?
// ticket.path was set in backend to "rejected"

Template.rejected_ticket.onCreated(function() {
  if(!Meteor.userId())
  {
    FlowRouter.go('/');
    return;
  }

  var self = this;
  self.autorun(function() {
    self.subscribe('EventRegistration');
    self.subscribe('userData');

  });

});

Template.rejected_ticket.onRendered(function() {

/*  var user = Meteor.users.findOne({ _id: Meteor.userId() });
  console.log("user: " + user);
  if ( user.availableTickets === undefined ){
    user.availableTickets = 0;
  }
  Meteor.users.update({ _id: user._id }, { $set: { "tickets": user.availableTickets + 1 } }, function(err, result) {
    Tickets.update({_id: Session.get('ticketBoughtByUser')}, {$set: {status: 'finished'}});
  });*/

});

Template.rejected_ticket.helpers({
  ticket: function()
  {
      var  ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
      return ticket;

  },
  user: function()
  {
      var  user = Meteor.user();
      return user;

  }
});


Template.rejected_ticket.events({
  'click #event_registration': function(event) {
    event.preventDefault();
    var  ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    Tickets.update({_id: ticket._id}, {$set: {status: 'finished'}});
    Session.set("userUrl", "/event_registration");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #invite_friends': function(event) {
    event.preventDefault();
    var  ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    Tickets.update({_id: ticket._id}, {$set: {status: 'finished'}});
    Session.set("userUrl", "/invitation");
    FlowRouter.go(Session.get("userUrl"));
  }
});
