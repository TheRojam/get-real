Meteor.users.allow({
  update: function(userId, doc, fields, modifier) {
    if (Meteor.userId() === userId) {
      return true;
    } else {
      return false;
    }
  },
  insert: function(userId, doc) {
    if (Meteor.userId() === userId) {
      return true;
    } else {
      return false;
    }
  }
});

Turns.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  },
  insert: function(userId, doc) {
    return true;
  }
});

Proposals.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  }
});

Tickets.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  },
  insert: function(userId, doc) {
    return true;
  }
});

Matches.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  },
  insert: function(userId, doc) {
    return true;
  }
});

RankingGames.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  },
  insert: function(userId, doc) {
    return true;
  }
});

Feedbacks.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  },
  insert: function(userId, doc) {
    return true;
  }
});