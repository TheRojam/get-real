i18n = {};
i18n.t = function (stringToTranslate) {
  var language = TAPi18n.getLanguage();
  return stringToTranslate;
};

Template.registerHelper('debugger', function () {
    debugger;
  }
);