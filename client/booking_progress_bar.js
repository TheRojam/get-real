Template.booking_progress_bar.onCreated(function() {

  var self = this;
    self.autorun(function() {
      self.subscribe('EventBookings');
    });
});


Template.booking_progress_bar.helpers({
  bookingPercent: function(gameId) {
    var userGender = Meteor.user().profile.gender;
    var userGenderWanted = Meteor.user().profile.genderWanted;
    var game = Games.findOne({ _id: gameId });
/*    console.log("userGender: " + userGender);*/
/*    console.log("userGenderWanted: " + userGenderWanted);*/
    var tables = 0;
    var areaId = Games.findOne({ _id: gameId }).areaId;
    moment.locale('en'); // important for finding the fields in english (e.g. location.maxThursday)
    var locations = Locations.find({ status: 'enabled', areaId: areaId });  // all locations with their reservations
/*    console.log("locations: " + locations.count());*/
    if (locations) {
      locations.forEach(function(location) {
        var locationTables = eval('location.max' + moment(game.gameStart).format("dddd"));
        tables = tables + locationTables;
      });
    }
    var tickets = Tickets.find({ status: "bought", gameId: gameId });
/*    console.log("tickets: " + tickets.count());*/
    var userIds = [];
    if (tickets) {
      tickets.forEach(function(ticket) {
        userIds.push(ticket.userId);
      });
    } else {
      userIds = '';
    }

/*    console.log("userIds: " + userIds);*/
    if ( userGender !== userGenderWanted ){
      var sameUsers = Meteor.users.find({_id: {$in: userIds}, "profile.gender": userGender, "profile.genderWanted": userGenderWanted }).count();

/*      console.log("sameUsers: " + sameUsers);*/
      var hetero = true;
    }else{
      var sameUsers = 0;
      var hetero = false;
    }
    var otherUsers = Meteor.users.find({_id: {$in: userIds}, "profile.gender": userGenderWanted, "profile.genderWanted": userGender }).count();

/*    console.log("otherUsers: " + otherUsers);*/

    var sameRate = Math.round(( sameUsers / tables ) *100);
    var otherRate = Math.round(( otherUsers / tables ) *100);
/*    console.log(sameUsers + " sameUsers / " + tables + " tables = " + sameRate + "%" );*/
/*    console.log(otherUsers + " otherUsers / " + tables + " tables = " + otherRate + "%" );*/
    var tmp = {
      locations: locations,
      tables: tables,
      tickets: tickets,
      hetero: hetero,
      sameRate: sameRate,
      otherRate: otherRate
    };
    return tmp;
  }
});

Template.booking_progress_bar.onRendered(function() {
  $('.tooltipped').tooltip();
});