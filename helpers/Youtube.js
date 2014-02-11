/*
  
  youtube template helper class

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
      hash.src = hash.src.indexOf('://') > 0 ? hash.src : 'http://www.youtube.com/embed/' + hash.src + '?feature=player_embedded';

      return self.html('iframe', hash);
    }
  });
});