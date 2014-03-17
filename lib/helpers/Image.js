/*

  image template helper class

  just a shortcut for embedding images

*/

define([

  '../render/TemplateHelper'

], function (TemplateHelper) {

  return TemplateHelper.extend({

    'run': function (src) {

      var self = this;
      var options = self.opts(arguments);
      var hash = options.hash;

      hash.src = typeof src === 'string' ? src : hash.src;

      if (hash.src.indexOf('site') === 0) {
        hash.src = '/' + hash.src;
      }
      else {
        hash.src = self.currentUrl === '/' ? self.currentUrl + hash.src : self.currentUrl + '/' + hash.src;
      }

      hash.selfClose = true;

      return self.html('img', hash);
    }
  });
});