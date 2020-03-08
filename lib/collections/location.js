var Schema = {
  name: {
    type: String,
    label: "",
    index: true,
		unique: true
	},
  address: {
    type: String,
    label: ""
  },
  type: {
    type: String,
		allowedValues: ["Café", "Bar", "Restaurant", "Public space"],
    label: "Cafe, bar etc"
  },
  // DGB 2014-12-16 05:32 Added
  picture: {
    type: String,
    optional: true
  },
  googleAddress: {
    type: String,
    label: "Address for Google maps"
  },
  googlePlusId: {
    type: String,
    label: "",
    optional: true
  },
  areaId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Associated Area"
  },
  creatorId: {
    type: String,
    label: "Creator id",
    optional: true
  },
  status: {
    type: String,
    allowedValues: ["draft", "reviewed", "enabled", "disabled"],
    label: 'Location must have an status'
  },
  maxMonday: {
    type: Number,
    defaultValue: 10
  },
  maxTuesday: {
    type: Number,
    defaultValue: 10
  },
  maxWednesday: {
    type: Number,
    defaultValue: 10
  },
  maxThursday: {
    type: Number,
    defaultValue: 10
  },
  maxFriday: {
    type: Number,
    defaultValue: 10
  },
  maxDaturday: {
    type: Number,
    defaultValue: 10
  },
  maxSunday: {
    type: Number,
    defaultValue: 10
  }
};

Locations.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
