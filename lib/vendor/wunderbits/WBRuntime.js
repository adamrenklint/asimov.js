define([

  './lib/dependencies',
  './global',
  './helpers/console',
  './WBEnvironmentModel',
  './WBSingleton',

  './mixins/WBBindableMixin',
  './mixins/WBEventsMixin',
  './mixins/WBTimelineMixin'

], function (

  dependencies,
  global, Console,
  WBEnvironmentModel,
  WBSingleton, WBEventsMixin, WBTimelineMixin,
  WBBindableMixin,
  undefined

) {

  'use strict';

  var WBRuntime = WBSingleton.extend({

    'mixins': [
      WBBindableMixin,
      WBEventsMixin,
      WBTimelineMixin
    ],

    'init': function () {

      var self = this;

      // core dependencies
      self.global = global;
      self.console = Console;

      self._ = dependencies._;
      self.$ = dependencies.$;
      self.Backbone = dependencies.Backbone;
      self.w_ = dependencies.w_;

      self.env = WBEnvironmentModel.init();

      self.debouncedTriggerResize = self._.debounce(self.triggerResize, 250);
      self.bindTo(self.$(global), 'resize', self.debouncedTriggerResize);
    },

    'debouncedTriggerResize': undefined,

    'triggerResize': function () {

      var self = this;
      self.trigger('window:resize');
    },

    'currentRoute': function () {

      var self = this;
      return (self.global.location.hash || '').replace('#/', '').replace('#', '');
    },

    'currentDomain': function () {

      var self = this;
      return self.global.location.hostname || '';
    }
  });

  WBRuntime.init();
  return WBRuntime;
});