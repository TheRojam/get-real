var Schema = {
  gameId: {
    type: new Mongo.Collection.ObjectID(),
    label: "Game id",
		index: true
  },
  userId: {
    type: String,
    label: "User id",
		index: true
  },
  path: {
    type: String,
    label: "DId this ticket generate a date or was it rejected",
		optional: true
  },
  status: {
    type: String,
    label: "bought, converted",
		allowedValues: ["bought","converted", "rejected", "finished", "dating", "feedback", "returned"]
  },
  areaId: {
    type: new Mongo.Collection.ObjectID()
  },
  matchingpointsCreated: {
    type: Boolean
  }
};

Tickets.attachSchema(new SimpleSchema(_.extend(Schema,commonSchema)));
