/*

  page file update handler base class

*/

define([

  './UpdateHandler'

], function (UpdateHandler) {

  var _super = UpdateHandler.prototype;

  return UpdateHandler.extend({

    'namespace': 'PageHandler',

    'collection': function () {

      var self = this;
      return self.options.pages;
    }
  });
});