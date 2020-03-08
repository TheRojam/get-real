Log.warn("The server is up and running");

Accounts.onCreateUser(function (options, user) {
/*  Log.info(options);*/
/*  Log.info(user);*/
  user.approved = false;
  user.availableTickets = 2;
  user.acceptedBeforePrinciples = false;
  user.acceptedOnPrinciples = false;
  user.acceptedAfterPrinciples = false;
  user.seenProcedure = false;
  user.context = "normal";
  user.profile = {};
  user.profile.photo = "";
  user.profile.photoName = "";
  user.profile.language = "de";
  user.profile.name = "";
  user.profile.birthYear = "";
  user.firstTimeEvent = true;
  user.firstTimeChat = true;

/*  SMS verification  */
/*const min = 10000,
  max = 99999,
  OTP = Math.floor(Math.random() * (max - min + 1)) + min;*/
  user.OTP = options.OTP;
  user.isMobileVerified = false;

  return user;
});
