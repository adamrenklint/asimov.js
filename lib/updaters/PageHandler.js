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

      var self = this;
      var modified = self.options.pages.find(function (page) {
        return page.attributes.path.indexOf(path) >= 0;
      });

      modified && modified.fetch();
    },

    'deleted': function (path) {
    }
  });
});