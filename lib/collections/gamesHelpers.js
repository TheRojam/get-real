Games.helpers({
  eventStarted: function() {
   return (moment.duration(moment(this.eventStart).subtract(moment()))>0) ? false : true;
  },
  gameStarted: function() {
   return (moment.duration(moment(this.gameStart).subtract(moment()))>0) ? false : true;
  },
  helpersWork: function() {
    return true;
  }
});
 
