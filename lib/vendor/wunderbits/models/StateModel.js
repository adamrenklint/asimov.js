define([

  '../WBClass',
  '../mixins/WBEventsMixin',
  '../mixins/StatefulMixin'

], function (
  WBClass, WBEventsMixin, StatefulMixin,
  undefined
) {

  'use strict';

  return WBClass.extend({

    'mixins': [
      WBEventsMixin,
      StatefulMixin
    ],

    'initialize': function (attributes) {

      var self = this;

      if (attributes) {
        self.attributes = attributes;
      }
    }
  });
});