
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
var gameCardLanguages = new SimpleSchema({
  en: {
    type: String
  },
  de: {
    type: String
  }
});

var Schema = {
  halfLife: {
    type: Number,
    label: "How long a card is valid",
    optional: true
  },
  locale: {
    type: gameCardLanguages,
    label: "Translated questions"
  },
  selected: {
    type: Number,
    label: "Number of selected times"
  },
  status: {
    type: String,
    label: "Is it a draft or ready for production",
    allowedValues: ["active","published"]
  },
  stage: {
    type: Number,
    label: "In which stage should be this game card be shown - Not relevant we only have one stage now",
    optional: true
  },
  creatorId: {
    type: String,
    label: "Which admin created this game card"
  },
  proposerId: {
    type: String,
    label: "Which admin created this game card"
  },
  note: {
    type: String,
    label: "For aditional comments",
    optional: true
  },
  answerEmbrace: {
    type: gameCardLanguages,
    label: "Answer embrace",
    optional: true
  },
  answerPositive: {
    type: gameCardLanguages,
    label: "Answer positive",
    optional: true
  },
  answerNegative: {
    type: gameCardLanguages,
    label: "Answer negative",
    optional: true
  },
  answerHate: {
    type: gameCardLanguages,
    label: "Answer hate",
    optional: true
  },
  answerAvoid: {
    type: gameCardLanguages,
    label: "Answer avoid",
    optional: true
  },
  intimacy: {
    type: Number,
    label: "Intimacy level of Gamecard",
    optional: true
  },
  group: {
    type: String,
    label: "GameCard group",
    optional: true
  },
  gr_importance: {
    type: Number,
    label: "Importance for get:real",
    optional: true
  },
  category: {
    type: String,
    label: "Category of the Gamecard",
    optional: true
  }
};


GameCards.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));