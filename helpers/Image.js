/*

  image template helper class

  just a shortcut for embedding images

*/

define([

  '../lib/render/TemplateHelper'

], function (TemplateHelper) {

  return TemplateHelper.extend({

    'run': function (src) {

      var self = this;
      var options = self.opts(arguments);
      var hash = options.hash;

      hash.src = typeof src === 'string' ? src : hash.src;
      hash.src = hash.src.indexOf('site/') === 0 ? '/' + hash.src : self.currentUrl + '/' + hash.src;

      hash.selfClose = true;

      return self.html('img', hash);
    }
  });
});