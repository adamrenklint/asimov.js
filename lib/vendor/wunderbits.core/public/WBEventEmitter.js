define([

  './WBClass',
  './mixins/WBBindableMixin',
  './mixins/WBEventsMixin'

], function (WBClass, WBBindableMixin, WBEventsMixin) {

  'use strict';

  return WBClass.extend({

    'mixins': [
      WBBindableMixin,
      WBEventsMixin
    ]
  });
});