
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
  name: {
    type: String,
    label: "Name of the area"
  },
  country: {
    type: String,
    label: "Country of the city"
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

userAreaContributions.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));