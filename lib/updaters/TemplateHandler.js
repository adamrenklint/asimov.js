/*

  template file update handler class

*/

define([

  './UpdateHandler'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'TemplateHandler',

    'collection': function () {

      var self = this;
      return self.options.templates;
    }
  });
});