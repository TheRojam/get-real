var Schema = {
  userId: {
    type: String,
/*    type: new Mongo.Collection.ObjectID(),*/
    optional: true
  },
  code: {
    type: String,
    optional: true
  },
  invitedUserId: {
/*    type: new Mongo.Collection.ObjectID(),*/
    type: String,
    optional: true
  },
  invitationSend: {
    type: Date,
    optional: true
  },
  invitationAccepted: {
    type: Date,
    optional: true
  }
};

userInvitations.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));