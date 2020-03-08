var Schema = {
  gameStart: {
    type: Date,
    label: "When do game start"
  },
  gameFinish: {
    type: Date,
    label: ""
  },
  eventStart: {
    type: Date,
    label: "When do the event start"
  },
  eventFinish: {
    type: Date,
    label: "When we will consider the event finished (And the user will be unblocked and able to move around in the app again)"
  },
	areaId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Associated Area"
  },
  feedbackStart: {
    type: Date,
    label: "When does the feedback start"
  },
  feedbackFinish: {
    type: Date,
    label: "When does the feedback finish"
  },
  message: {
    type: String,
    optional: true
  },
  creatorId: {
    type: String,
    label: "",
    optional: true
  },
  matchesCreated: {
    type: Boolean,
    optional: false
  },
  startReminderSend: {
    type: Boolean,
    label: "Flag for Push notification for Chat start",
    optional: true
  },
  endReminderSend: {
    type: Boolean,
    label: "Flag for Push notification for 15 minutes before Chat ends",
    optional: true
  },
  goDateReminderSend: {
    type: Boolean,
    label: "Flag for Push notification to prepare to go to Date",
    optional: true
  },
  dateStartReminderSend: {
    type: Boolean,
    label: "Flag for Push notification for the start of the Date",
    optional: true
  },
  dateEndReminderSend: {
    type: Boolean,
    label: "Flag for Push notification for the end of the Date",
    optional: true
  },
  feedbackReminderSend: {
    type: Boolean,
    label: "Flag for Push notification for Feedback",
    optional: true
  },
  maxTurns: {
    type: Number,
    defaultValue: 1
  }
};

Games.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));

