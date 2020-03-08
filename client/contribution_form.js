Template.contribution_form.onRendered(function () {
  $('.collapsible').collapsible();
});

Template.contribution_form.events({

  // for question contributions

  'click #question_contribution_btn': function (event) {

    var userId = Meteor.userId();
    var questionContribution = $('#question_contribution').val();
    var embraceContribution = $('#embrace_contribution').val();
    var positiveContribution = $('#positive_contribution').val();
    var negativeContribution = $('#negative_contribution').val();
    var hateContribution = $('#hate_contribution').val();
    var avoidContribution = $('#avoid_contribution').val();
    var noteContribution = $('#note_contribution').val();
    var userLanguage = TAPi18n.getLanguage();
    if (userId && questionContribution && embraceContribution && positiveContribution && negativeContribution && hateContribution && avoidContribution && noteContribution && userLanguage) {
      Meteor.call("addQuestionContribution", userId, questionContribution, embraceContribution, positiveContribution, negativeContribution, hateContribution, avoidContribution, noteContribution, userLanguage, function (err, result) {
        if (err) {
          // console.log(err);
        }
        // console.log(result);
        if (result && result !== null) {
          $('#question_contribution').val("");
          $('#embrace_contribution').val("");
          $('#positive_contribution').val("");
          $('#negative_contribution').val("");
          $('#hate_contribution').val("");
          $('#avoid_contribution').val("");
          $('#note_contribution').val("");
          M.Collapsible.getInstance($('.collapsible')).close(0);
        }
      });
    }
  },
  // checks for complete question form
  'blur #question_form textarea': function (event) {

    var questionContribution = $('#question_contribution').val();
    var embraceContribution = $('#embrace_contribution').val();
    var positiveContribution = $('#positive_contribution').val();
    var negativeContribution = $('#negative_contribution').val();
    var hateContribution = $('#hate_contribution').val();
    var avoidContribution = $('#avoid_contribution').val();
    var noteContribution = $('#note_contribution').val();

    if ( questionContribution && embraceContribution && positiveContribution && negativeContribution && hateContribution && avoidContribution && noteContribution ) {
      Session.set("incompleteQuestionContribution", false);
    } else {
      Session.set("incompleteQuestionContribution", true);
    }
  },

  // for location contributions

  'click #location_contribution_btn': function (event) {

    var userId = Meteor.userId();
    var locationNameContribution = $('#location_name_contribution').val();
    var locationCityContribution = $('#location_city_contribution').val();
    var locationSearchContribution = $('#location_search_contribution').val();
    var locationNoteContribution = $('#location_notes_contribution').val();
    var userLanguage = TAPi18n.getLanguage();
    if (userId && locationNameContribution && locationCityContribution && locationSearchContribution && locationNoteContribution && userLanguage) {
      Meteor.call("addLocationContribution", userId, locationNameContribution, locationCityContribution, locationSearchContribution, locationNoteContribution, userLanguage, function (err, result) {
        if (err) {
          // console.log(err);
        }
        // console.log(result);
        if (result && result !== null) {
          $('#location_name_contribution').val("");
          $('#location_city_contribution').val("");
          $('#location_search_contribution').val("");
          $('#location_notes_contribution').val("");
          M.Collapsible.getInstance($('.collapsible')).close(1);
        }
      });
    }
  },
  // checks for complete location form
  'blur #location_form textarea': function (event) {

    var locationNameContribution = $('#location_name_contribution').val();
    var locationCityContribution = $('#location_city_contribution').val();
    var locationSearchContribution = $('#location_search_contribution').val();
    var locationNoteContribution = $('#location_notes_contribution').val();

    if ( locationNameContribution && locationCityContribution && locationSearchContribution && locationNoteContribution ) {
      Session.set("incompleteLocationContribution", false);
    } else {
      Session.set("incompleteLocationContribution", true);
    }
  },

  // for area contributions

  'click #area_contribution_btn': function (event) {

    var userId = Meteor.userId();
    var areaNameContribution = $('#area_name_contribution').val();
    var areaCountryContribution = $('#area_country_contribution').val();
    var userLanguage = TAPi18n.getLanguage();
    if (userId && areaNameContribution && areaCountryContribution && userLanguage) {
      Meteor.call("addAreaContribution", userId, areaNameContribution, areaCountryContribution, userLanguage, function (err, result) {
        if (err) {
          // console.log(err);
        }
        // console.log(result);
        if (result && result !== null) {
          $('#area_name_contribution').val("");
          $('#area_country_contribution').val("");
          M.Collapsible.getInstance($('.collapsible')).close(2);
        }
      });
    }
  },
  // checks for complete area form
  'blur #area_form textarea': function (event) {

    var areaNameContribution = $('#area_name_contribution').val();
    var areaCountryContribution = $('#area_country_contribution').val();
    if ( areaNameContribution && areaCountryContribution ) {
      Session.set("incompleteAreaContribution", false);
    } else {
      Session.set("incompleteAreaContribution", true);
    }
  }

});
// userId && questionContribution && embraceContribution && positiveContribution && negativeContribution && hateContribution && avoidContribution && noteContribution && userLanguage

Template.contribution_form.helpers({
  gameCardComplete: function() {
    return Session.get('incompleteQuestionContribution');
  },
  locationComplete: function() {
    return Session.get('incompleteLocationContribution');
  },
  areaComplete: function() {
    return Session.get('incompleteAreaContribution');
  }
});
