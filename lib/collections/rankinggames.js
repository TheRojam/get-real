var Schema = {
  gameId: {
    type: new Mongo.Collection.ObjectID()
  },
  creatorId: {
    type: String
  },
  userIdRanked: {
    type: String
  },
  position: {
    type: Number
  }
};

RankingGames.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
