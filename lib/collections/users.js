
// the profile sub-collection

var userProfile = new SimpleSchema({
  signInCount: {
    type: Number,
    optional: true
  },
  genderWanted: {
    type: String,
    optional: true
  },
  youngerWanted: {
    type: Boolean,
    optional: true
  },
  sameWanted: {
    type: Boolean,
    optional: true
  },
  olderWanted: {
    type: Boolean,
    optional: true
  },
  gender: {
    type: String,
    optional: true
  },
  upperAge: {
    type: Number,
    optional: true
  },
  lowerAge: {
    type: Number,
    optional: true
  },
  country: {
    type: String,
    optional: true
  },
  city: {
    type: String,
    optional: true
  },
  latitude: {
    type: Number,
    optional: true
  },
  longitude: {
    type: Number,
    optional: true
  },
  birthYear: {
    type: Number,
    optional: true
  },
  photo: {
    type: String,
    optional: true,
    blackbox: true
  },
  photoName: {
    type: String,
    optional: true
  },
  language: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    optional: true
  }
});


// the user collection

var Schema = {
  username: {
    type: String,
    optional: true
  },
  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: true
  },
  approved: {
    type: Boolean
  },
  seenProcedure: {
    type: Boolean
  },
  acceptedBeforePrinciples: {
    type: Boolean
  },
  acceptedOnPrinciples: {
    type: Boolean
  },
  acceptedAfterPrinciples: {
    type: Boolean
  },
  approval_by: {
    type: String,
    optional: true
  },
  profile: {
    type: userProfile,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  context: {
    type: String,
    label: "Context for users",
    allowedValues: ["test", "tutorial", "production", "normal"]
  },
  availableTickets: {
    type: Number,
    optional: true
  },
  OTP: {
    type: String,
    label: "SMS verification code",
    optional: true
  },
  isMobileVerified: {
    type: Boolean,
    label: "Flag for SMS verification",
    optional: true
  },
  SMSsendDate: {
    type: Date,
    label: "When was last SMS send",
    optional: true
  },
  lastAreaId: {
    type: new Mongo.Collection.ObjectID(),
    label: "The last area the user applied for",
    optional: true
  },
  lastGameReminder: {
    type: Date,
    label: "The last push reminder that got send",
    optional: true
  },
  changePassword: {
    type: Date,
    label: "Last time user sent a new password",
    optional: true
  },
  firstTimeEvent: {
    type: Boolean,
    label: "The first time explanation",
    optional: true
  },
  firstTimeChat: {
    type: Boolean,
    label: "The first time explanation",
    optional: true
  },
  approvalRequested: {
    type: String,
    label: "Admin has been reminded to approve account",
    optional: true
  },
  inviterId: {
    type: String,
/*    type: new Mongo.Collection.ObjectID(),*/
    optional: true,
    label: "User that invited this user"
  }
};

Meteor.users.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
