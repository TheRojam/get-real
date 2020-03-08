Meteor.startup(function () {
  setInterval(function () {
    Meteor.call("getServerTime", function (error, result) {
      if(result){
        Session.set("time", result);
      }
    });
  }, 1000);
  TAPi18n.setLanguage(getUserLanguage());
});

var timeToFinish = new ReactiveVar(undefined);
/**
 * [CountdownClock description]
 * @param {Date} timeWhenCountdownMustFinish [description]
 * @param {String} path [description]
 * @param {String} paramFormatTimeToShow       [description]
 */
CountdownClock = function (timeWhenCountdownMustFinish, path, paramFormatTimeToShow) {
  if(!timeWhenCountdownMustFinish){
    return 'No time provided for the countdown';
  }
  // console.log("Gamefinish in countdown: " + timeWhenCountdownMustFinish);
  if(timeWhenCountdownMustFinish){
    var countdownTime = moment.duration(moment(timeWhenCountdownMustFinish).diff(Session.get("time")), 'milliseconds');
    timeToFinish.set(countdownTime);
    countdownTime = moment.duration(moment(timeWhenCountdownMustFinish).diff(Session.get("time")), 'milliseconds');
    timeToFinish.set(countdownTime);
    if(countdownTime.asSeconds()<=0) {
      // FlowRouter.go(path);
      console.log("Countdown redirect to: " + path);
      Session.set("userUrl", path);
      FlowRouter.go(Session.get("userUrl"));
    }
    var days = timeToFinish.get()._data.days.toString();
    if(timeToFinish.get()._data.hours<10){
      days = '0' + timeToFinish.get()._data.days.toString();
    }
    var hours = timeToFinish.get()._data.hours.toString();
    if(timeToFinish.get()._data.hours<10){
      hours = '0' + timeToFinish.get()._data.hours.toString();
    }
    var minutes = timeToFinish.get()._data.minutes.toString();
    if(timeToFinish.get()._data.minutes<10){
      minutes = '0' + timeToFinish.get()._data.minutes.toString();
    }
    var seconds = timeToFinish.get()._data.seconds.toString();
    if(timeToFinish.get()._data.seconds<10){
      seconds = '0' + timeToFinish.get()._data.seconds.toString();
    }
    if(timeToFinish.get()._data.seconds<0){
      return i18n.t("Ready");
    }
    var s = "<span style='font-size:0.5em;'>";
    var cs = "</span>";
    //Log.info(days + s + 'D' + cs + ':' +hours+ s + 'H' + cs + ':' +minutes+ s + 'M' + cs + ':' +seconds + s + 'S' + cs);
    if(paramFormatTimeToShow==='d'){
      return days + s + 'T' + cs + ':' +hours+ s + 'S' + cs + ':' +minutes+ s + 'M' + cs + ':' +seconds + s + 'S' + cs;
    }
    if(paramFormatTimeToShow==='h'){
      return hours + s + 'S' + cs + ':' +minutes+ s + 'M' + cs + ':' +seconds+ s + 'S' + cs;
    }
    if(paramFormatTimeToShow==='m'){
      return minutes + s + 'M' + cs + ':' +seconds+ s + 'S' + cs;
    }
  }
};
