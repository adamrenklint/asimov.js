/*
  
  image template helper class

  just a shortcut for embedding images

*/

define([

  '../lib/render/TemplateHelper',
  'lodash'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (src) {

      var self = this;
      var options = self.opts(arguments);
      var hash = options.hash;

      hash.src = _.isString(src) ? src : hash.src;
      hash.src = self.currentUrl + '/' + hash.src;

      hash.selfClose = true;

      return self.html('img', hash);
    }
  });
});