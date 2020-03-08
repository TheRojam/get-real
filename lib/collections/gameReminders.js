var Schema = {
  userId: {
    type: String,
    label: "Who got the reminder"
  },
  sendTime: {
    type: Date,
    label: "When did get:real push the reminder"
  },
  turnId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Which turn was going when the reminder was send"
  },
  matchId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Which match was going when the reminder was send"
  },
	gameId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Which game was going when the reminder was send"
  }
};

GameReminders.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));

