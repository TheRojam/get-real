var Schema = {
  gameId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Game id"
  },
  locationId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Location id"
  },
  userId: {
    type: String,
    label: "Feedback giving User"
  },
  dateId: {
    type: String,
    label: "Dated User"
  },
  feedback_1: {
    type: Boolean,
    label: "punctual",
    optional: true
  },
  feedback_2: {
    type: Boolean,
    label: "interested",
    optional: true
  },
  feedback_3: {
    type: Boolean,
    label: "felt safe",
    optional: true
  },
  feedback_4: {
    type: Boolean,
    label: "respect",
    optional: true
  },
  feedback_5: {
    type: Boolean,
    label: "nice location",
    optional: true
  },
  feedback_6: {
    type: Boolean,
    label: "nice evening",
    optional: true
  },
  feedback_7: {
    type: Boolean,
    label: "number exchange",
    optional: true
  },
  gotInvite: {
    type: Boolean,
    label: "Flag for invitation code checked",
    optional: true
  },
  free_feedback_date: {
    type: String,
    label: "free feedback for the date",
    optional: true
  },
  free_feedback_app: {
    type: String,
    label: "free feedback for get:real",
    optional: true
  }
};

Feedbacks.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
