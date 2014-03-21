/*

  update handler base class

*/

define([

  '../core/Base'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'UpdateHandler',

    'created': function (path) {

      throw new Error('UpdateHandler must implement created(string path)');
    },

    'modified': function (path) {

      throw new Error('UpdateHandler must implement modified(string path)');
    },

    'deleted': function (path) {

      throw new Error('UpdateHandler must implement deleted(string path)');
    }
  });
});