var api = Meteor.settings.public.bugsnag_api;
var vers = Meteor.settings.public.version;
var stage = Meteor.settings.public.stage;


window.bugsnagClient = bugsnag({
	apiKey: api,
	appVersion: vers,
	releaseStage:stage
});

//console.log('api'+api+' vers '+ vers+' stage '+ stage);


window.onerror = function (errorMsg, url, lineNumber) {

  const error = new Error(errorMsg);
  error.stack = "Error: " + errorMsg + " Script: " + url + " Line: " +    lineNumber;
  bugsnagClient.notify(error);
};

//Test
//bugsnagClient.notify(new Error('Test errorsss'));


Meteor.startup(function(){



  if (Meteor.isCordova){

    M.toast({html: TAPi18n.__('welcome_back')});
    document.addEventListener('resume', function() {
      Session.set("userUrl", "/redirect");
      FlowRouter.go(Session.get("userUrl"));
    });
/*    document.addEventListener("pause", function() {
        Session.set("userUrl", "/redirect");
        Meteor.disconnect()
    });*/

    document.addEventListener("backbutton", onBackButtonDown, false);

    Push.Configure({
      android: {
        senderID: 343760448637,
        alert: true,
        badge: true,
        sound: true,
        vibrate: true,
        clearNotifications: true,
        icon: 'pushicon',
        iconColor: '#FF8291'
      },
      ios: {
        alert: true,
        badge: true,
        sound: true
      }
    });


    Push.allow({
        send: function(userId, notification) {
            return true; // Allow all users to send
        }
    });
      //Push.debug = true
      //window.alert = navigator.notification.alert;
    //  window.prompt = navigator.notification.prompt;

     Push.addListener('token', function(token) {
     console.log('token received: ' + JSON.stringify(token));
    });

    Push.addListener('error', function(err) {
        console.log(err);
    //  window.plugins.toast.showLongBottom(err, function(args){console.log(args.event);},function(error){console.error('error toast', error);});


    });
    Push.addListener('message', function(notification) {
     // Called on every message
     console.log(JSON.stringify(notification))
     //alert(notification.message);
    // window.plugins.toast.showLongTop(notification.message, function(args){console.log(args.event);}, function(error){console.error('error toast', error);});
		function alertDismissed() {
			NotificationHistory.update({_id: notification.payload.historyId}, {
				$set: {
					"recievedAt": new Date()
				}
			});
		}
		alert(notification.message, alertDismissed, notification.payload.title, "Ok");

   });

   Push.addListener('alert', function(notification) {
     // Called on every message
    // Dialog.alert(notification.message);
  //   window.plugins.toast.showLongCenter(notification.message, function(args){console.log(args.event);}, function(error){console.error('error toast', error);});

/*window.plugins.toast.showWithOptions({
  message: notification.message,
  duration: "6000", // 2000 ms
  position: "top",
  styling: {
    //backgroundColor: '#A20202', // make sure you use #RRGGBB. Default #333333
    textColor: '#FFFFFF', // Ditto. Default #FFFFFF
    textSize: 21, // Default is approx. 13.
    cornerRadius: 6, // minimum is 0 (square). iOS default 20, Android default 100
    opacity: 1, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
    horizontalPadding: 40, // iOS default 16, Android default 50
    verticalPadding: 40 // iOS default 12, Android default 30
  }
});*/
  function alertDismissed() {
    NotificationHistory.update({_id: notification.payload.historyId}, {
      $set: {
        "recievedAt": new Date()
      }
    });
  }
  alert(notification.message, alertDismissed, notification.payload.title, "Ok");
     //console.log(notification.message);
     // callbacks

   });

   function onBackButtonDown(event) {
     var user = Meteor.user();
     if ( user && user.seenProcedure === true && user.acceptedBeforePrinciples === true && user.acceptedOnPrinciples === true && user.acceptedAfterPrinciples === true ){
       if ( Session.get('backUrl') ){
         Session.set("userUrl", Session.get('backUrl'));
       }else{
         Session.set("userUrl", "/redirect");
       }
       FlowRouter.go(Session.get("userUrl"));
     }else{
       return false;
     }
   }

}

});




