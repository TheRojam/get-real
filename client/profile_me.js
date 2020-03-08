Template.profile_me.onCreated(function() {

  var self = this;
    self.autorun(function() {
      self.subscribe('userData');

    });

    $('#alertprofile').hide();
});

Template.profile_me.helpers({
  userDatas: function()
  {
      var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
      return userData;
  },
  yearSelection: function() {
    var max = moment().year() - 18,
        min = max - 90;
    return _.range(max, min, -1);
  },
  userProfileGenderMale: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.gender) {
      if (Meteor.user().profile.gender ==='male') {
        return true;
      }
    }
  },
  userProfileGenderFemale: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.gender) {
      if (Meteor.user().profile.gender === 'female') {
        return true;
      }
    }
  },
  userProfileGenderWantedFemale: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.genderWanted) {
      if (Meteor.user().profile.genderWanted === 'female') {
        return true;
      } else {
        return false;
      }
    }
  },
  userProfileGenderWantedMale: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.genderWanted) {
      if (Meteor.user().profile.genderWanted === 'male') {
        return true;
      } else {
        return false;
      }
    }
  },
  userProfileAgeWantedYounger: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.youngerWanted) {
      if (Meteor.user().profile.youngerWanted === true) {
        return true;
      } else {
        return false;
      }
    }
  },
  userProfileAgeWantedSame: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.sameWanted) {
      if (Meteor.user().profile.sameWanted === true) {
        return true;
      } else {
        return false;
      }
    }
  },
  userProfileAgeWantedOlder: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.olderWanted) {
      if (Meteor.user().profile.olderWanted === true) {
        return true;
      } else {
        return false;
      }
    }
  },
  ////////////////////////// no language select in v1, only 'de' ///////////////////////
  // userProfileLanguageEn: function() {
//     if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.language) {
//       if (Meteor.user().profile.language ==='en') {
//         TAPi18n.setLanguage('en');
//         Session.set("currentUserLanguage", 'en');
//         return true;
//       } else {
//         return false;
//       }
//     }
//   },
//   userProfileLanguageDe: function() {
//     if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.language) {
//       if (Meteor.user().profile.language === 'de') {
//         TAPi18n.setLanguage('de');
//         Session.set("currentUserLanguage", 'de');
//         return true;
//       }else {
//         return false;
//       }
//     }
//   },
////////////////////////// no language select in v1, only 'de' ///////////////////////
  photo: function() {
    if (!Session.get("photo") && Meteor.user()
        && Meteor.user().profile && Meteor.user().profile.photoName) {
      return Meteor.user().profile.photo;
    } else {
      return Session.get("photo");
    }
  },
  hasName: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.name) {
      return Meteor.user().profile.name;
    } else {
      return false;
    }
  },
  hasBirthYear: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.name && Meteor.user().profile.birthYear) {
      return Meteor.user().profile.birthYear;
    } else {
      return false;
    }
  },
  hasGender: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.gender) {
      return Meteor.user().profile.gender;
    } else {
      return false;
    }
  },
  hasGenderWanted: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.genderWanted) {
      return Meteor.user().profile.genderWanted;
    } else {
      return false;
    }
  },
  hasAgePreference: function() {
    if (Meteor.user() && Meteor.user().profile && (Meteor.user().profile.youngerWanted === true || Meteor.user().profile.sameWanted === true || Meteor.user().profile.olderWanted === true ) ) {
      return true;
    } else {
      return false;
    }
  },
  isApproved: function() {
    if (Meteor.user() && Meteor.user().approved === true) {
      return true;
    } else {
      return false;
    }
  },
  isBlocked: function() {
    if (Meteor.user() && Meteor.user().status_message === "blocked") {
      return true;
    } else {
      return false;
    }
  },
  profileComplete: function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photoName
        && Meteor.user().profile && Meteor.user().profile.birthYear
        && Meteor.user().profile.genderWanted
        && Meteor.user().profile.gender && Meteor.user().profile.name) {
      if (Meteor.user().profile.youngerWanted === true || Meteor.user().profile.sameWanted === true || Meteor.user().profile.olderWanted === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    ////////////////////////// no language select in v1, only 'de' ///////////////////////
    // has to be added for the profile check
    // && Meteor.user().profile.language
    ////////////////////////// no language select in v1, only 'de' ///////////////////////
  }
});

Template.profile_me.events({
  "change #name": function(event, template) {
    event.preventDefault();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.name': template.$("#name").val() } }, function(err, result) {
      if (result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      }
      if (err) {
        console.log(err);
      }
    });
  },
  "change #birthyear": function(event, template) {
    var birthyear = template.$("#birthyear").val();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
      template.$('#alertprofile').fadeIn();
      template.$('#alertprofile').fadeOut();
    });
  },
  "click #maleWanted": function(event, template) {
    event.preventDefault();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.genderWanted": "male" } }, function(err, result) {
      template.$('#alertprofile').fadeIn();
      template.$('#alertprofile').fadeOut();
    });
  },
  "click #femaleWanted": function(event, template) {
    event.preventDefault();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.genderWanted": "female" } }, function(err, result) {
      template.$('#alertprofile').fadeIn();
      template.$('#alertprofile').fadeOut();
    });
  },
  "click #female": function(event, template) {
    event.preventDefault();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.gender": "female" } }, function(err, result) {
      template.$('#alertprofile').fadeIn();
      template.$('#alertprofile').fadeOut();
    });
  },
  "click #male": function(event, template) {
    event.preventDefault();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.gender": "male" } }, function(err, result) {
      template.$('#alertprofile').fadeIn();
      template.$('#alertprofile').fadeOut();
    });
  },
  // DGB 2014-12-18 08:50 Click event fails in browser in mobile mode
  "click #next_event_registration": function() {
    if (Meteor.user() && Meteor.user().approved !== true){
      if (Meteor.user().context !== "tutorial") {
        Meteor.users.update({ _id: Meteor.userId() }, { $set: { "approvalRequested": "ready_for_approval" } });
        Session.set("userUrl", "/not_approved");
      }else{
        Session.set("userUrl", "/event_registration");
      }
    }else{
      Session.set("userUrl", "/event_registration");
    }
    FlowRouter.go(Session.get("userUrl"));
  },
  "click #youngerWanted": function(event, template) {
    event.preventDefault();
    if (Meteor.user().profile.youngerWanted === true) {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.youngerWanted": false } }, function(err, result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      });
    } else {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.youngerWanted": true } }, function(err, result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      });
    }
  },
  "click #sameWanted": function(event, template) {
    event.preventDefault();
    if (Meteor.user().profile.sameWanted === true) {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.sameWanted": false } }, function(err, result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      });
    } else {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.sameWanted": true } }, function(err, result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      });
    }
  },
  "click #olderWanted": function(event, template) {
    event.preventDefault();
    if (Meteor.user().profile.olderWanted === true) {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.olderWanted": false } }, function(err, result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      });
    } else {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.olderWanted": true } }, function(err, result) {
        template.$('#alertprofile').fadeIn();
        template.$('#alertprofile').fadeOut();
      });
    }
  },
  ////////////////////////// no language select in v1, only 'de' ///////////////////////
  // "change #lang": function(event, template) {
  //   event.preventDefault();
  //   var language = template.$('#lang').val();
  //   TAPi18n.setLanguage(template.$('#lang').val()).done(function() {
  //     Session.set("showLoadingIndicator", false);
  //   })
  //   .fail(function(errorMessage) {
  //     // Handle the situation
  //     console.log(errorMessage);
  //   });
  //   Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.language": language } });
  //   template.$('#alert').fadeIn();
  //   template.$('#alert').fadeOut();
  // },
  ////////////////////////// no language select in v1, only 'de' ///////////////////////
  "click #take_photo": function(event) {
    event.preventDefault();
    if (Meteor.isCordova) {
      cordova.plugins.diagnostic.isCameraAuthorized(
        authorized => {
          if (!authorized) {
            cordova.plugins.diagnostic.requestCameraAuthorization(
              granted => {
                console.log( "Authorization request for camera use was " +
                  (granted ? "granted" : "denied"));
              },
              error => { console.error(error); }
            );
          }
        },
        error => { console.error(error); }
      );
    }
    takePhoto();

  },
  "click #photo": function(event) {
    event.preventDefault();
    if (Meteor.isCordova) {
      cordova.plugins.diagnostic.isCameraAuthorized(
        authorized => {
          if (!authorized) {
            cordova.plugins.diagnostic.requestCameraAuthorization(
              granted => {
                console.log( "Authorization request for camera use was " +
                  (granted ? "granted" : "denied"));
              },
              error => { console.error(error); }
            );
          }
        },
        error => { console.error(error); }
      );
    }
    takePhoto();
  },
  "click #change_password_btn": function() {
    Session.set('errorRegister', undefined);
    Session.set("userUrl", "/change_password");
    FlowRouter.go(Session.get("userUrl"));
  },
  'click #logout-btn': function () {
    Session.set('errorRegister', undefined);
    Meteor.logout();
    Session.set("userUrl", "/");
    FlowRouter.go(Session.get("userUrl"));
  }
});


/**
 * [takePhoto description]
 * @return {[type]} [description]
 */
var takePhoto = function() {
  var cameraOptions = {
    quality: 100,
    correctOrientation: true,
    encodingType: 0
  };

  // Replace these fields before executing `MeteorCamera.getPicture()` like:
 //   ```javascript
 //  MeteorCamera.locale.errorBrowserNotSupported = "Sorry, this browser is currently not supported for camera functionality.";
 //  MeteorCamera.locale.errorAccesingCamera = "There was an error accessing the camera.";
 //  MeteorCamera.locale.usePhoto = "Use Photo";
 //  MeteorCamera.locale.takeNewPhoto = "Take New Photo";
 //  MeteorCamera.locale.waitingPermissions = "Waiting for camera permissions...";
 //  MeteorCamera.locale.takePhoto = "Take Photo";
 //  MeteorCamera.locale.cancel = "Cancel";
 //  MeteorCamera.locale.closePopup = "Close Popup";
 //  MeteorCamera.locale.permissionsDenied = "Camera Permissions Denied";
 //  MeteorCamera.locale.permissionsDeniedExp = "You have denied this app permission to use your camera. If you would like to allow permissions, follow the directions for your browser below.";
 //  MeteorCamera.locale.howToChrome = 'Go to Settings > "Show advanced settings..." > "Content settings..." > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.';
 //  MeteorCamera.locale.howToFirefox = "Reload the page and try again.";
 //  MeteorCamera.locale.howToOpera = 'Go to Preferences > Websites > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.';
 //  ```
 //   with corresponding translations in your language.

 MeteorCamera.locale = {
     errorBrowserNotSupported: "Sorry, this browser is currently not supported for camera functionality.",
     errorAccesingCamera: "There was an error accessing the camera.",
     usePhoto: "Foto nutzen",
     takeNewPhoto: "Neues Foto schießen",
     waitingPermissions: "Waiting for camera permissions...",
     takePhoto: "Take Photo",
     cancel: "Cancel",
     closePopup: "Close Popup",
     permissionsDenied: "Camera Permissions Denied",
     permissionsDeniedExp: "You have denied this app permission to use your camera. If you would like to allow permissions, follow the directions for your browser below.",
     howToChrome: 'Go to Settings > "Show advanced settings..." > "Content settings..." > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.',
     howToFirefox: "Reload the page and try again.",
     howToOpera: 'Go to Preferences > Websites > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.'
 }

  MeteorCamera.getPicture(cameraOptions, function(error, data) {
    if (error){
      Log.error("No photo taken");
    }
    if (data){
      var photoName = Meteor.userId() + '_photo.jpeg';
       resizeImage(data, 600, 600, function(result) {
         Session.set("photo", result);
         Meteor.users
           .update(
             {
               _id: Meteor.userId()
             },
             {
               $set: { "profile.photoName": photoName, "profile.photo": result }
             }
         );
       });

    }
  });
};

/**
 * [resizeImage description]
 * @param  {[type]}   url      [description]
 * @param  {[type]}   width    [description]
 * @param  {[type]}   height   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var resizeImage = function(url, width, height, callback) {
  var sourceImage = new Image();
  sourceImage.onload = function() {


    // draw image to canvas and get image data
   var canvas = document.createElement("canvas");
   canvas.width = this.width;
   canvas.height = this.height;
   var ctx = canvas.getContext("2d");
   ctx.drawImage(sourceImage, 0, 0, this.width, this.height);


   var imageData = ctx.getImageData(Math.max(0, (sourceImage.width-300)/2), Math.max(0, (sourceImage.height-300)/2), 300, 300);
   console.log("width:"+this.width+" height: "+this.height+"destwidth: "+300+"destheight: "+300+"posx: "+Math.max(0, (sourceImage.width-300)/2)+"posy: "+ Math.max(0, (sourceImage.height-300)/2));
   // create destiantion canvas
   var canvas1 = document.createElement("canvas");
   canvas1.width = 300;
   canvas1.height =  300;
   var ctx1 = canvas1.getContext("2d");
   ctx1.rect(0, 0, 300,  300);
   ctx1.fillStyle = 'white';
   ctx1.fill();
   ctx1.putImageData(imageData, 0, 0);

  callback(canvas1.toDataURL("image/png"));

  };
  sourceImage.src = url;
};


Template.profile_me.rendered = function() {
  $('#alertprofile').hide();
  $('.datepicker').datepicker();
};
