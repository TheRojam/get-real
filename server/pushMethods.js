Meteor.startup(function () {
Push.Configure({
gcm: {
  projectNumber: 343760448637,
  apiKey: 'AAAAUAm4LH0:APA91bHxTFNATY9G9NuvszLS8chTeiK8gLUpWw03WSkaqo7ydaLvqJezCglyAbR-MkQQxElT5w03qSyo-qqLci0p7IdxJuS9XEr_Ly3rPJEOAyIFiEWD_FbLpgE5RPQ-yffig2edEJ4m'  // GCM/FCM server key
},
  apn: {
    certData: Assets.getText('aps.pem'),
    keyData: Assets.getText('push.pem'),
    passphrase: 'Test123!',
    production: true,
    gateway: 'gateway.push.apple.com',
  }
});



//Push.debug = true;
Push.addListener('token', function(currentToken, newToken) {
    // Token is { apn: 'xxxx' } or { gcm: 'xxxx' } or null
    // if newToken is null then the currentToken is invalid
    // if newToken is set then this should replace the currentToken
});

Push.allow({
    send: function(userId, notification) {
        return true; // Allow all users to send
    }
});

Meteor.methods({
    serverNotification: function(text,title) {
        var badge = 1
        Push.send({
            from: 'push',
            title: title,
            text: text,
            token: {},
            tokens: [{},{}],
            // badge: badge,
            'content-available': 1,
            //alert: true,
            query: {
                // this will send to all users
            }
        });
    },
    userNotification: function(text,title,userId,numberID) {
        var badge = 1
        Push.send({
            from: 'push',
            title: title,
            text: text,
            token: {},
            tokens: [{},{}],
            // badge: badge,
            notID: numberID, // somehow multiple doesn't work yet: https://github.com/raix/push/blob/master/docs/ADVANCED.md
            query: {
              userId: userId //this will send to a specific Meteor.user()._id
              // userId: {$in : users} // for multiple Users, must be tested
            }
        });
    }
});
});
