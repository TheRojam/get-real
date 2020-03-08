Template.feedback_form.onCreated(function() {

  var self = this;
  self.autorun(function() {
    self.subscribe('userData');
    self.subscribe('CurrentFeedback');
  });

  Session.set('backUrl', '/feedback_form'); // inside a game

});

Template.feedback_form.helpers({
  userData: function()
  {
      var  userData = Meteor.users.findOne({ _id: Meteor.userId() });
      return userData;

  },
  feedbackData: function()
  {
      var  feedback = Feedbacks.findOne({}, { sort: { createdAt: -1 } });
      var  dateData = Meteor.users.findOne({ _id: feedback.dateId });
/*      console.log("Date:", dateData.profile.name);*/
      var tmp = {
        feedback: feedback,
        dateName: dateData.profile.name
      };
      return tmp;

  },
  inTutorial: function() {
    if ( Meteor.user().context == "tutorial" ) {
      return true;
    }else{
      return false;
    }
  }
  //,
//   profileComplete: function() {
//     if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.photoName
//         && Meteor.user().profile && Meteor.user().profile.birthYear
//         && Meteor.user().profile.genderWanted && Meteor.user().profile.language
//         && Meteor.user().profile.gender && Meteor.user().profile.name) {
//       return true;
//     } else {
//       return false;
//     }
//   }
});

Template.feedback_form.events({
  // "click change #feedback_1_pos": function(event, template) {
 //    event.preventDefault();
 //    var fb1 = template.$("input[name='feedback_1']:checked").val();
 //    var current_feedback = Feedbacks.findOne({gameId: Session.get("gameId"), userId: Meteor.userId() })
 //    // Feedbacks.update({ _id: current_feedback._id }, { $set: { feedback_1: fb1 } });
 //    console.log("test: ");
 //    console.log(current_feedback._id);
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },
 //  "click change input[name='feedback_2']": function(event, template) {
 //    event.preventDefault();
 //    console.log("FB_1: " + fb1);
 //    var fb1 = template.$("input[name='feedback_2']:checked").val();
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },
 //  "click change input[name='feedback_3']": function(event, template) {
 //    event.preventDefault();
 //    var fb1 = template.$("input[name='feedback_3']:checked").val();
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },
 //  "click change input[name='feedback_4']": function(event, template) {
 //    event.preventDefault();
 //    var fb1 = template.$("input[name='feedback_4']:checked").val();
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },
 //  "click change input[name='feedback_5']": function(event, template) {
 //    event.preventDefault();
 //    var fb1 = template.$("input[name='feedback_5']:checked").val();
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },
 //  "click change input[name='feedback_6']": function(event, template) {
 //    var fb1 = template.$("input[name='feedback_6']:checked").val();
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },
 //  "click change input[name='feedback_7']": function(event, template) {
 //    var fb1 = template.$("input[name='feedback_7']:checked").val();
 //    //Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.birthYear": birthyear } }, function(err, result) {
 //    //  template.$('#alertprofile').fadeIn();
 //    //  template.$('#alertprofile').fadeOut();
 //  //  });
 //  },

  // switches to page 2
  "click #next_step": function(event, template) {
    event.preventDefault();
    template.$('#feedback_page_1').fadeOut();
    template.$('#feedback_page_2').fadeIn();
    var fb1 = (template.$("input[name='feedback_1']:checked").val() === undefined ? false : true);
    var fb2 = (template.$("input[name='feedback_2']:checked").val() === undefined ? false : true);
    var fb3 = (template.$("input[name='feedback_3']:checked").val() === undefined ? false : true);
    var fb4 = (template.$("input[name='feedback_4']:checked").val() === undefined ? false : true);
    var fb5 = (template.$("input[name='feedback_5']:checked").val() === undefined ? false : true);
    var fb6 = (template.$("input[name='feedback_6']:checked").val() === undefined ? false : true);
    var fb7 = (template.$("input[name='feedback_7']:checked").val() === undefined ? false : true);
    var current_feedback = Feedbacks.findOne({}, { sort: { createdAt: -1 } });
    // To Do: Add two text-fields and remove allow, add server method
    Feedbacks.update({ _id: current_feedback._id }, { $set: { feedback_1: fb1, feedback_2: fb2, feedback_3: fb3, feedback_4: fb4, feedback_5: fb5, feedback_6: fb6, feedback_7: fb7 } });
    // console.log("test: ");
    // console.log("FB_1: " + fb1);
    // console.log(current_feedback);
    var sec = 5;
    var myTimer = document.getElementById('myTimer');
    var myBtn = document.getElementById('feedback_finish');
    countDown();

    function countDown() {
      if (sec < 10) {
        myTimer.innerHTML = "0" + sec;
      } else {
        myTimer.innerHTML = sec;
      }
      if (sec <= 0) {
        $("#feedback_finish").removeClass('disabled');
        $("#myTimer").fadeTo(2500, 0);
        return;
      }
      sec -= 1;
      window.setTimeout(countDown, 1000);
    }
  },

  // DGB 2014-12-18 08:50 Click event fails in browser in mobile mode
  "blur #feedback_date_content": function(event, template) {
    var current_feedback = Feedbacks.findOne({}, { sort: { createdAt: -1 } });
    var ffd = template.$("#feedback_date_content").val();
    var ffa = template.$("#feedback_app_content").val();
    Feedbacks.update({ _id: current_feedback._id }, { $set: { free_feedback_date: ffd, free_feedback_app: ffa } });

    // OLD functionality to force feedbacks
    // console.log("ffd: " + ffd);
    // console.log("ffa: " + ffa);
    /*if ( ffd !== "" && ffa !== "" ){
      $("#feedback_finish").removeClass('disabled');
    }else{
      $("#feedback_finish").addClass('disabled');
    }*/
  },
  "blur #feedback_app_content": function(event, template) {
    var current_feedback = Feedbacks.findOne({}, { sort: { createdAt: -1 } });
    var ffd = template.$("#feedback_date_content").val();
    var ffa = template.$("#feedback_app_content").val();
    Feedbacks.update({ _id: current_feedback._id }, { $set: { free_feedback_date: ffd, free_feedback_app: ffa } });

    // OLD functionality to force feedbacks
    // console.log("ffd: " + ffd);
    // console.log("ffa: " + ffa);
/*    if ( ffd !== "" && ffa !== "" ){
      $("#feedback_finish").removeClass('disabled');
    }else{
      $("#feedback_finish").addClass('disabled');
    }*/
  },
  "click #feedback_finish": function(event, template) {
    var ticket = Tickets.findOne({}, { sort: { createdAt: -1 } });
    var current_feedback = Feedbacks.findOne({}, { sort: { createdAt: -1 } });
    if ( current_feedback ){
      Tickets.update({ _id: ticket._id }, { $set: { status: 'finished' } });
      Session.set("userUrl", "/event_registration");
      FlowRouter.go(Session.get("userUrl"));
    }
  },
  "change #lang": function(event, template) {
    event.preventDefault();
    var language = template.$('#lang').val();
    TAPi18n.setLanguage(template.$('#lang').val()).done(function() {
      Session.set("showLoadingIndicator", false);
    })
    .fail(function(errorMessage) {
      // Handle the situation
      console.log(errorMessage);
    });
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.language": language } });
    template.$('#alert').fadeIn();
    template.$('#alert').fadeOut();
  }
});


Template.feedback_form.onRendered(function() {
  $('#alertprofile').hide();
/*  if (Meteor.isCordova){
    document.addEventListener("backbutton", onBackButtonDown, false);
  };*/
});

/*function onBackButtonDown(event) {
  return false;
}*/