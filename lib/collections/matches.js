var Schema = {
  playerOneId: {
    type: String,
    label: "Id player one",
    index: true,
  },
  playerTwoId: {
    type: String,
    label: "Id player two",
    index: true,
  },
  stage: {
    type: String,
    label: "Stage",
    optional: true
  },
  bestMatch: {
    type: Boolean,
    label: "Populated when the bestMatch algortymh runs to flag that this one is the best match for this user for this game"
  },
  locationId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Populated when the bestMatch algortymh runs to choose a different location per match if it is possible"
  },
  gameId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Id game"
  },
  seedColor: {
    type: Number,
    optional: true
  },
  position: {
    type: Number
  },
  isFinished: {
    type: Boolean,
    label: "Populated when when all rounds have been played"
  },
  connected: {
    type: Boolean,
    label: "True if users agreed in feedback to connect"
  }
};

Matches.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
