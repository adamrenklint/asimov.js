/*
  
  ▲ asimov.js json template helper class

*/

define([

  '../lib/render/TemplateHelper'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (hash) {

      var self = this;
      hash = hash || {};

      return JSON.stringify(hash);
    }
  });
});