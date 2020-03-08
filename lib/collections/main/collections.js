// DGB 2014-09-11
// At the end of the file we unset collections that dones't need to go to the client
//Real Collections

GameCards = new Meteor.Collection("GameCards", {idGeneration: 'MONGO'});
Games = new Meteor.Collection("Games", {idGeneration: 'MONGO'});
Areas = new Meteor.Collection("Areas", {idGeneration: 'MONGO'});
Matches = new Meteor.Collection("Matches", {idGeneration: 'MONGO'});
Proposals = new Meteor.Collection("Proposals", {idGeneration: 'MONGO'});
Tickets = new Meteor.Collection("Tickets", {idGeneration: 'MONGO'});
Turns = new Meteor.Collection("Turns", {idGeneration: 'MONGO'});
Locations = new Meteor.Collection("Locations", {idGeneration: 'MONGO'});
RankingGames = new Meteor.Collection("RankingGames", {idGeneration: 'MONGO'});
Feedbacks = new Meteor.Collection("Feedbacks", {idGeneration: 'MONGO'});
userGameCardContributions = new Meteor.Collection("userGameCardContributions", {idGeneration: 'MONGO'});
userLocationContributions = new Meteor.Collection("userLocationContributions", {idGeneration: 'MONGO'});
userAreaContributions = new Meteor.Collection("userAreaContributions", {idGeneration: 'MONGO'});
userInvitations = new Meteor.Collection("userInvitations", {idGeneration: 'MONGO'});
GameReminders = new Meteor.Collection("GameReminders", {idGeneration: 'MONGO'});
AdminMessages = new Meteor.Collection("AdminMessages", {idGeneration: 'MONGO'});
// users = new Meteor.Collection("users", {idGeneration: 'MONGO'});

/*
GameCards = new Mongo.Collection("GameCards");
Games = new Mongo.Collection("Games");
Areas = new Mongo.Collection("Areas");
Matches = new Mongo.Collection("Matches");
Proposals = new Mongo.Collection("Proposals");
Tickets = new Mongo.Collection("Tickets");
Turns = new Mongo.Collection("Turns");
Locations = new Mongo.Collection("Locations");
RankingGames = new Mongo.Collection("RankingGames");*/

commonSchema = {
  createdAt: {
		type: Date,
    autoValue: function() {
			if (this.isInsert) {
				return new Date();
			}
			if (this.isUpsert) {
				return {$setOnInsert: new Date()};
			}
			else {
				this.unset();
			}
		},
		optional: true
	},
  updatedAt: {
    type: Date,
		autoValue: function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert: true,
		optional: true
  },
	/* DGB 2014-09-23 The history still doesn't work as it should. We will work on this later
	history: {
		type: [Object],
		optional: true,
		autoValue: function() {
			//var updateObject = this.field();
			if (this.isInsert) {
				return [{
					date: new Date(),
					user: this.userId,
					//update: updateObject.value
				} ];
			}
			else {
				return { $push: {
					date: new Date(),
					user: this.userId,
					//update: updateObject.value
				} };
			}
		}
	},
	*/
	/*
	'history.$.date': {
		type: Date(),
		optional: true
	},
  'history.$.user': {
		type: String,
		optional: true
	}*/
	/*
	'history.$.update': {
		type: [Object],
		optional: true
	}
	*/
};


