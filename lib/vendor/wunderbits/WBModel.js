define([

  './lib/dependencies',
  './lib/createUID',
  './mixins/WBInstanceUtilitiesMixin',
  './mixins/WBBindableMixin',
  './mixins/WBDeferrableMixin'

], function (dependencies, createUID, WBInstanceUtilitiesMixin, WBBindableMixin, WBDeferrableMixin, undefined) {

  'use strict';

  var Backbone = dependencies.Backbone;

  var _super = Backbone.Model.prototype;

  return Backbone.Model.extend({

    'initialize': function () {

      var self = this;
      self.uid = createUID();

      WBBindableMixin.applyTo(self);
      WBInstanceUtilitiesMixin.applyTo(self);
      WBDeferrableMixin.applyTo(self);
    },

    'destroy': function () {

      var self = this;
      self.destroying = true;
      _super.destroy.apply(self, arguments);
    },

    'save': function () {

      var self = this;
      !self.destroying && _super.save.apply(self, arguments);
    },

    'clear': function () {

      var self = this;

      _super.clear.apply(self, arguments);
      self.save(self.defaults);
    }
  });
});