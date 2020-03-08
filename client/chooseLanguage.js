// TO DO: check if still i nuser. Set language in methods.js

/**
 * [getUserLanguage description]
 * @return {[type]} [description]
*/
getUserLanguage = function() {
  // Put here the logic for determining the user language
  var language = TAPi18n.getLanguage();
  // v1 default language only 'de', later we can add language select again
  //Log.info(language);
  // if (language === 'de') {
  //   return language;
  // } else {
  //   return 'en';
  // }
  return 'de';
};

Meteor.startup(function() {
  Session.set("showLoadingIndicator", true);
  TAPi18n.setLanguage(getUserLanguage())
    .done(function() {
      Session.set("showLoadingIndicator", false);
    })
    .fail(function(errorMessage) {
      console.log(errorMessage);
    });
});
