Template.area_select.onRendered(function () {
  $('select').formSelect();
  if (Meteor.user().lastAreaId !== undefined ){
    Session.set('idAreaSelected', Meteor.user().lastAreaId._str);
  }else{
    Session.set('idAreaSelected', '-1');
  }
});

Template.area_select.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('EventRegistration');
  });
});

Template.area_select.helpers({
  areas: function()
  {
    var areas = Areas.find({ status: 'enabled', context: Meteor.user().context });
    return areas.fetch();
  },
  games: function()
  {
    var games = Games.find({ matchesCreated: false, gameStart: { $gt: new Date() } });
    return games;
  },
  lastAreaId: function()
  {
    return Meteor.user().lastAreaId;
  },
  isLastArea: function(areaId)
  {
    return (Meteor.user().lastAreaId === areaId);
  }
});