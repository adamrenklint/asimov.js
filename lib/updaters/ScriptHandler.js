/*

  script file update handler class

*/

define([

  './UpdateHandler'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'ScriptHandler',

    'collection': function () {

      var self = this;
      return false;
    }
  });
});