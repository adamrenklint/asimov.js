/*
  
  ▲ asimov.js active template helper class

  checks if the provided url is the active one,
  and then returns the value provided

*/

define([

  '../lib/render/TemplateHelper',
  'lodash'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (url, value) {

      var self = this;
      var options = self.opts(arguments);
      var hash = options.hash;

      if (url === self.currentUrl) {
        return value;
      }
    }
  });
});