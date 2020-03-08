var Schema = {
  adminId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Id of admin"
  },
  userId: {
    type: String,
    label: "Id of user, if single message"
  },
  channel: {
    type: String,
    label: "push or sms",
		allowedValues: ["push","sms"]
  },
  type: {
    type: String,
    label: "all or user",
		allowedValues: ["all","user"]
  },
  title: {
    type: String,
    label: "Title of the message",
		optional: true
  },
  text: {
    type: String,
    label: "Title of the message",
		optional: true
  },
  status: {
    type: String,
    label: "status of the message",
		allowedValues: ["draft","waiting", "send", "deleted"]
  },
  sendDate: {
    label: "When was the message send",
    type: Date
  }
};

AdminMessages.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
