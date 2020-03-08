var Schema = {
  matchId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Match id",
    optional: true
  },
  gameId:{
    type: new Mongo.Collection.ObjectID(),
    label: "Game id",
    optional: true
  },
  activeId: {
    type: String,
    label: "Asking user",
    optional: true
  },
  passiveId: {
    type: String,
    label: "Answering user",
    optional: true
  },
  gameCardId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Selected game card from proposal",
    optional: true
  },
  questionChoose:{
    type: String,
    optional: true
  },
  importance: {
    type: String,
    label: "High, low",
    optional: true
  },
  acceptEmbrace: {
    type: Boolean,
    label: "Acepted answers by asking user",
    optional: true
  },
  acceptPositive: {
    type: Boolean,
    label: "Accept positive",
    optional: true
  },
  acceptNegative: {
    type: Boolean,
    label: "Accept negative",
    optional: true
  },
  acceptHate: {
    type: Boolean,
    label: "Accept hate",
    optional: true
  },
  acceptAvoid: {
    type: Boolean,
    label: "Accept avoid",
    optional: true
  },
  givenAnswerImportance: {
    type: String,
    label: "Answering user selection - Level of answer choosen, embrace, positive, negative, hate, avoid",
    optional: true
  },
  givenAnswer: {
    type: String,
    label: "Answering user selection - One of embrace, positive, negative, hate, avoid",
    optional: true
  },
  turnStart: {
    type: Number,
    label: "For statistics",
    optional: true
  },
  turnFinish: {
    type: Number,
    label: "Finish turn",
    optional: true
  },
  turnNumber: {
    type: Number,
    label: "Number of the Turn",
    optional: true
  },
  activeUserHasChoosenQuestion: {
    type: Boolean,
    label: "The question has been choosen"
  },
  activeUserHasChoosenAnswerPriority: {
    type: Boolean,
    label: "The answer priority has been choosen"
  }
};

Turns.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
