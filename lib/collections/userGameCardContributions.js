
/*var gameCardLanguages = new SimpleSchema({
  en: {
    type: String
  },
  es: {
    type: String
  },
  de: {
    type: String
  }
});*/

/**
 * LFG 07.10.2014 This object until we complete the questions that will populate the database for the first time
 */

var Schema = {
  creatorId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Which user created this game card proposal"
  },
  question: {
    type: String,
    label: "Question"
  },
  answerEmbrace: {
    type: String,
    label: "Answer embrace"
  },
  answerPositive: {
    type: String,
    label: "Answer positive"
  },
  answerNegative: {
    type: String,
    label: "Answer negative"
  },
  answerHate: {
    type: String,
    label: "Answer hate"
  },
  answerAvoid: {
    type: String,
    label: "Answer avoid"
  },
  note: {
    type: String,
    label: "Thoughts on the question",
    optional: true
  },
  language: {
    type: String,
    label: "Users language"
  },
  status: {
    type: String,
    label: "Status of contribution",
    optional: true
  },
  adminComment: {
    type: String,
    label: "Comment of an admin",
    optional: true
  }
};

userGameCardContributions.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));