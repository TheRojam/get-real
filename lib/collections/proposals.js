var Schema = {
  turnId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Turn Id",
    index: true
  },
  gameCardId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Game card id",
    index: true
  },
  // DGB 2014-09-23 I think this is redundant because we store this on the turn, but it can be useful for analitics
  selected: {
    type: Boolean,
    label: "For selected game card"
  },
  showed: {
    type: Boolean,
    label: "For showed game card"
  },
  /* DGB I think this is redundant, we only need turnId
  userId: {
    type: String,
    label: "User id",
    index: true
  },
  gameId: {
    type: String,
    label: "Game id",
    index: true
  },
  matchId: {
    type: String,
    label: "Match id",
    index: true
  }
  */
};

Proposals.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
