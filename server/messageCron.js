SyncedCron.add({
  name: 'Sends admin messages',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 5 minutes');
  },
  job: function() {
    // Log.info('Cron success');
    return checkMessages();
  }
});


var checkMessages = function () {
  var openMessages = AdminMessages.find({ status: "waiting" }, {sort: {createdAt: -1}});
  Log.info("openMessages:" + openMessages.count());
  openMessages.fetch().map(sendMessages);
  return true;
}

var sendMessages = function (message) {

  var now = new moment().toDate();  // figure out time now

  if ( message.type === "user" && message.userId ){
  // messages for single user
    if ( message.channel === "sms" ){
      // send single user SMS
      var SMStext = message.title + " - " + message.text;
      var mobile = Meteor.users.findOne({_id: message.userId}).username;
      Meteor.call('sendSMS', SMStext, mobile, (error) => {
        if(error) {
          return console.log(error);
        }
        AdminMessages.update({ _id: message._id }, { $set: {status: "send", sendDate: now  }});
      });
    }else if ( message.channel === "push" ) {
      // send single user push
      Meteor.call("userNotification", message.text, message.title, message.userId, 1, function (err, result) {
        if (err) {
          Log.info(err);
        }
        AdminMessages.update({ _id: message._id }, { $set: {status: "send", sendDate: now  }});
        Log.info(result);
      });
    }else{
      Log.info("no message due to false channel")
      return false;
    }

  }else if ( message.type === "all" ){
  // messages for all users
    if ( message.channel === "sms" ){
      // SMS for ALL users, could be expensive
      var SMStext = message.title + " - " + message.text;
      var allUsers = Meteor.users.find();
      allUsers.forEach(function(user) {
        if ( user.username && user.isMobileVerified === true ){
          Meteor.call('sendSMS', SMStext, user.username, (error) => {
            if(error) {
              return console.log(error);
            }
          });
        }
      });
      AdminMessages.update({ _id: message._id }, { $set: {status: "send", sendDate: now  }});
    }else if ( message.channel === "push" ) {
      // Push for ALL users
      Meteor.call("serverNotification", message.text, message.title, function (err, result) {
        if (err) {
          Log.info(err);
        }
        AdminMessages.update({ _id: message._id }, { $set: {status: "send", sendDate: now }});
        Log.info(result);
      });
    }else{
      Log.info("no message due to false channel")
      return false;
    }
  }else{
    Log.info("no message due to false type or missing userId")
    return false;
  }
};
