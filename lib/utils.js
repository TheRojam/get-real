/**
 * [trimInput description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
trimInput = function (val) {
	return val.replace(/^\s*|\s*$/g, "");
};

/**
* [blurImagesOnGame description]
* @param  {[type]} pixels [description]
* @return {[type]}        [description]
*/
blurImagesOnGame = function (pixels) {
   return "-webkit-filter: blur("+pixels+"px);-moz-filter: blur("+pixels+"px);-o-filter: blur("+pixels+"px);-ms-filter: blur("+pixels+"px);filter: blur("+pixels+"px);";
};

Meteor.env = (Meteor.settings && Meteor.settings.public && Meteor.settings.public.mode && Meteor.settings.public.mode=="production") ? "production" : "development";
