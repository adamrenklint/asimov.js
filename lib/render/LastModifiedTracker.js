/*

  last modified tracker class

*/

define([

  '../core/Base'

], function (Model, _, npath) {

  var _super = Model.prototype;

  return Model.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'save': function (path, date) {

      var self = this;
      self.logger.log('lastMod:' + path + date);
    }
  });
});