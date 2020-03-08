var Schema = {
  name: {
    type: String,
    label: "",
    index: true,
    unique: true
  },
  type: {
    type: String,
    allowedValues: ["City","Neighborhood"]
  },
  context: {
    type: String,
    label: "Context for areas",
    allowedValues: ["test", "tutorial", "production"]
  },
  tz: {
    type: String,
    label: "Iana Timezone Database http://www.iana.org/time-zones",
    optional: true
  },
  longitude: {
    type: Number,
    decimal: true,
    label: "Longitude needs to be a number"
  },
  latitude: {
    type: Number,
    decimal: true,
    label: "Latitude needs to be a number"
  },
  status: {
    type: String,
    label: "Is it a draft or ready for production",
    allowedValues: ["draft", "reviewed", "enabled", "disabled"]
  },
};

Areas.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));

