/*

  template file update handler base class

*/

define([

  './UpdateHandler'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'TemplateHandler',

    'created': function (path) {
    },

    'modified': function (path) {
    },

    'deleted': function (path) {
    }
  });
});