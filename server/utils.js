/**
 * [getRandomInt description]
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
getRandomInt =  function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// TODO: test app
/**
 * [remove description]
 * @return {[type]} [description]
 */
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};