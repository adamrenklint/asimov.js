/*

  page file update handler base class

*/

define([

  './UpdateHandler'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'PageHandler',

    'created': function (path) {

      var self = this;
      self.options.pages.fetch();
    },

    'modified': function (path, graph) {
    },

    'deleted': function (path) {
    }
  });
});